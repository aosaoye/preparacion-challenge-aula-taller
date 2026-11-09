import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { EnrollmentMap, Student, Workshop } from './src/types';
import { initialEnrollments, initialStudents, initialWorkshops } from './src/data/mockData';
import { ApiService } from './src/api/client';
import {
  FeaturedWorkshopCard,
  HomeHeader,
  NewItemModal,
  StatsPanel,
  StudentOverviewCard,
  WorkshopCard,
} from './src/components';
import {
  Avatar,
  Badge,
  Button,
  Card,
  ChipRow,
  CustomSwitch,
  Divider,
  EmptyState,
  gutter,
  ListRow,
  radius,
  Screen,
  Section,
  space,
  TabBar,
  TabKey,
  Text,
  ThemeProvider,
  toast,
  Toaster,
  useTheme,
} from './src/ui';

function MainApp() {
  const { isDark, colors, toggleTheme } = useTheme();

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabKey>('aula');

  // Core Data State
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);
  const [enrollments, setEnrollments] = useState<EnrollmentMap>(initialEnrollments);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'student' | 'workshop'>('student');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('');
  const [newWorkshopName, setNewWorkshopName] = useState('');
  const [newWorkshopInstructor, setNewWorkshopInstructor] = useState('');

  // Fetch from backend
  const loadData = async () => {
    try {
      const [fetchedStudents, fetchedWorkshops] = await Promise.all([
        ApiService.getAlumnos(),
        ApiService.getTalleres(),
      ]);
      if (fetchedStudents.length > 0) setStudents(fetchedStudents);
      if (fetchedWorkshops.length > 0) setWorkshops(fetchedWorkshops);
    } catch {
      // Fallback already handled in ApiService
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Datos actualizados');
  };

  const selectedWorkshop = useMemo(
    () => workshops.find((w) => w.id === selectedWorkshopId) ?? workshops[0] ?? {
      id: 1,
      name: 'General',
      instructor: 'Docente',
      color: '#E4531D',
      accent: '#FADCD2',
      capacity: 20,
    },
    [workshops, selectedWorkshopId]
  );

  // Workshop enrollment counts
  const workshopEnrollmentCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    workshops.forEach((w) => {
      counts[w.id] = (enrollments[w.id] ?? []).length;
    });
    return counts;
  }, [workshops, enrollments]);

  // Statistics
  const stats = useMemo(() => {
    const total = students.length;
    const enrolledSet = new Set<number>();
    Object.values(enrollments).forEach((arr) => arr.forEach((id) => enrolledSet.add(id)));
    const active = enrolledSet.size;

    let minW = workshops[0]?.name ?? 'Ninguno';
    let maxW = workshops[0]?.name ?? 'Ninguno';
    let minCount = Infinity;
    let maxCount = -1;

    workshops.forEach((w) => {
      const c = (enrollments[w.id] ?? []).length;
      if (c < minCount) {
        minCount = c;
        minW = w.name;
      }
      if (c > maxCount) {
        maxCount = c;
        maxW = w.name;
      }
    });

    return {
      total,
      active,
      minW: minCount === Infinity ? 'Ninguno' : `${minW} (${minCount})`,
      maxW: maxCount === -1 ? 'Ninguno' : `${maxW} (${maxCount})`,
    };
  }, [students, workshops, enrollments]);

  // Toggle student enrollment in selected workshop
  const handleToggleEnrollment = (studentId: number) => {
    const currentList = enrollments[selectedWorkshopId] ?? [];
    const isEnrolled = currentList.includes(studentId);
    let nextList: number[];

    if (isEnrolled) {
      nextList = currentList.filter((id) => id !== studentId);
      toast.info('Alumno desinscrito del taller');
    } else {
      if (currentList.length >= selectedWorkshop.capacity) {
        toast.warn('Capacidad máxima del taller alcanzada');
        return;
      }
      nextList = [...currentList, studentId];
      toast.success('Alumno inscrito en el taller');
    }

    setEnrollments((prev) => ({
      ...prev,
      [selectedWorkshopId]: nextList,
    }));
  };

  // Add items
  const handleOpenStudentModal = () => {
    setModalMode('student');
    setNewStudentName('');
    setNewStudentCourse('');
    setModalVisible(true);
  };

  const handleOpenWorkshopModal = () => {
    setModalMode('workshop');
    setNewWorkshopName('');
    setNewWorkshopInstructor('');
    setModalVisible(true);
  };

  const handleSaveModal = async () => {
    if (modalMode === 'student') {
      if (!newStudentName.trim()) {
        toast.error('Ingresa el nombre del alumno');
        return;
      }
      const created = await ApiService.createAlumno(newStudentName.trim(), [selectedWorkshopId]);
      if (newStudentCourse.trim()) {
        created.course = newStudentCourse.trim();
      }
      setStudents((prev) => [created, ...prev]);
      setEnrollments((prev) => ({
        ...prev,
        [selectedWorkshopId]: [...(prev[selectedWorkshopId] ?? []), created.id],
      }));
      setModalVisible(false);
      toast.success(`Alumno ${created.name} registrado`);
    } else {
      if (!newWorkshopName.trim()) {
        toast.error('Ingresa el nombre del taller');
        return;
      }
      const created = await ApiService.createTaller(newWorkshopName.trim());
      if (newWorkshopInstructor.trim()) {
        created.instructor = newWorkshopInstructor.trim();
      }
      setWorkshops((prev) => [...prev, created]);
      setSelectedWorkshopId(created.id);
      setModalVisible(false);
      toast.success(`Taller ${created.name} creado`);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    await ApiService.deleteAlumno(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setEnrollments((prev) => {
      const next: EnrollmentMap = {};
      Object.entries(prev).forEach(([wId, arr]) => {
        next[Number(wId)] = arr.filter((studentId) => studentId !== id);
      });
      return next;
    });
    toast.info('Alumno eliminado');
  };

  const handleDeleteWorkshop = async (id: number) => {
    await ApiService.deleteTaller(id);
    setWorkshops((prev) => prev.filter((w) => w.id !== id));
    if (selectedWorkshopId === id) {
      setSelectedWorkshopId(workshops.find((w) => w.id !== id)?.id ?? 1);
    }
    toast.info('Taller eliminado');
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.course.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (categoryFilter === 'todos') return true;
      if (categoryFilter === 'inscritos') {
        return (enrollments[selectedWorkshopId] ?? []).includes(s.id);
      }
      if (categoryFilter === 'libres') {
        return !(enrollments[selectedWorkshopId] ?? []).includes(s.id);
      }
      return s.course.toLowerCase() === categoryFilter.toLowerCase();
    });
  }, [students, search, categoryFilter, enrollments, selectedWorkshopId]);

  // Categories for filter chip row
  const filterOptions = useMemo(() => {
    const list = [
      { key: 'todos', label: 'Todos', count: students.length },
      { key: 'inscritos', label: 'Inscritos en taller', count: (enrollments[selectedWorkshopId] ?? []).length },
      { key: 'libres', label: 'Libres' },
    ];
    const courses = Array.from(new Set(students.map((s) => s.course)));
    courses.forEach((c) => list.push({ key: c.toLowerCase(), label: c }));
    return list;
  }, [students, enrollments, selectedWorkshopId]);

  return (
    <Screen edges={['top', 'bottom']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Cabecera Principal estilo Cashbank / X en el tope de toda la app */}
      <HomeHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNew={activeTab === 'talleres' ? handleOpenWorkshopModal : handleOpenStudentModal}
        avatarName="Docente"
      />

      {/* TAB 1: AULA (INICIO & DASHBOARD DESTACADO) */}
      {activeTab === 'aula' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
        >
          {/* Próxima sesión activa (Hero Card) */}
          <View style={{ paddingHorizontal: gutter, paddingTop: space.md }}>
            <View
              style={[
                s.lessonCard,
                {
                  backgroundColor: isDark ? '#16181C' : '#FFFFFF',
                  borderColor: isDark ? '#2F3336' : '#EFF3F4',
                },
              ]}
            >
              <View style={s.lessonTop}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="kicker" style={{ color: colors.accent }}>
                    Próxima sesión en vivo
                  </Text>
                  <Text
                    variant="title"
                    numberOfLines={1}
                    style={{ color: colors.ink, fontWeight: '800' }}
                  >
                    {selectedWorkshop.name}
                  </Text>
                  <Text variant="caption" style={{ color: colors.muted }}>
                    Docente titular: {selectedWorkshop.instructor}
                  </Text>
                </View>

                <View
                  style={[
                    s.timerRing,
                    {
                      borderColor: colors.accent,
                      backgroundColor: isDark ? '#202327' : '#FCE5DD',
                    },
                  ]}
                >
                  <Text
                    variant="label"
                    style={{ color: colors.accent, fontWeight: '800' }}
                  >
                    4 min
                  </Text>
                </View>
              </View>

              <View style={s.lessonMetaRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Feather name="clock" size={15} color={colors.muted} />
                  <Text variant="caption" style={{ color: colors.muted }}>
                    10:00 - 10:45 AM
                  </Text>
                </View>

                <Badge
                  label={`${Math.max(0, selectedWorkshop.capacity - (workshopEnrollmentCounts[selectedWorkshop.id] ?? 0))} plazas disponibles`}
                  tone="accent"
                />
              </View>

              {/* Barra de progreso de capacidad */}
              <View
                style={[
                  s.progressBarTrack,
                  { backgroundColor: isDark ? '#2F3336' : '#EFF3F4' },
                ]}
              >
                <View
                  style={[
                    s.progressBarFill,
                    {
                      width: `${Math.min(100, ((workshopEnrollmentCounts[selectedWorkshop.id] ?? 0) / selectedWorkshop.capacity) * 100)}%`,
                      backgroundColor: colors.accent,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Carrusel de Talleres Destacados estilo Cashbank (con peek de 28px) */}
          <View style={{ gap: space.xs, marginTop: space.xs }}>
            <View style={s.sectionTitleRow}>
              <Text variant="heading" style={{ color: colors.ink }}>
                Talleres Destacados
              </Text>
              <Pressable onPress={() => setActiveTab('talleres')}>
                <Text variant="caption" style={{ color: colors.accent, fontWeight: '700' }}>
                  Ver todos ({workshops.length})
                </Text>
              </Pressable>
            </View>

            <FeaturedWorkshopCard
              workshops={workshops}
              selectedWorkshopId={selectedWorkshopId}
              workshopEnrollmentCounts={workshopEnrollmentCounts}
              onSelectWorkshop={(id) => {
                setSelectedWorkshopId(id);
                const w = workshops.find((item) => item.id === id);
                if (w) toast.info(`Taller activo: ${w.name}`);
              }}
            />
          </View>

          {/* Horario del Día estilo Twitter Feed */}
          <View style={{ paddingHorizontal: gutter, gap: space.sm }}>
            <Text variant="heading" style={{ color: colors.ink }}>
              Horario de Clases
            </Text>

            {[
              {
                time: '10:00 - 10:45',
                title: selectedWorkshop.name,
                teacher: selectedWorkshop.instructor,
                dur: '45 min',
              },
              {
                time: '11:00 - 11:45',
                title: 'Matemáticas y Algoritmos',
                teacher: 'Dr. Marco Lee',
                dur: '45 min',
              },
              {
                time: '12:00 - 12:45',
                title: 'Laboratorio de Ciencias',
                teacher: 'Dra. Carla Díaz',
                dur: '45 min',
              },
            ].map((item, idx) => (
              <View
                key={idx}
                style={[
                  s.scheduleRow,
                  {
                    backgroundColor: isDark ? '#16181C' : '#FFFFFF',
                    borderColor: isDark ? '#2F3336' : '#EFF3F4',
                  },
                ]}
              >
                <View
                  style={[
                    s.timeBadge,
                    { backgroundColor: isDark ? '#202327' : '#F7F9F9' },
                  ]}
                >
                  <Text
                    variant="caption"
                    style={{ fontWeight: '700', color: colors.ink }}
                  >
                    {item.time}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text variant="label" style={{ color: colors.ink }}>
                    {item.title}
                  </Text>
                  <Text variant="caption" style={{ color: colors.muted }}>
                    {item.teacher}
                  </Text>
                </View>

                <Badge label={item.dur} tone="neutral" />
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* TAB 2: ALUMNOS (DIRECTORIO Y FEED) */}
      {activeTab === 'alumnos' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
        >
          {/* Fila de chips de filtro al 100% del ancho como en Twitter/X */}
          <View style={{ paddingTop: space.sm }}>
            <ChipRow
              options={filterOptions}
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val)}
            />
          </View>

          {/* Directorio de Alumnos en lista plana con Divider */}
          <StudentOverviewCard
            search={search}
            onSearchChange={setSearch}
            filteredStudents={filteredStudents}
            selectedWorkshopId={selectedWorkshopId}
            workshopName={selectedWorkshop.name}
            onToggleEnrollment={handleToggleEnrollment}
            onDeleteStudent={handleDeleteStudent}
            isEnrolled={(id) => (enrollments[selectedWorkshopId] ?? []).includes(id)}
          />
        </ScrollView>
      )}

      {/* TAB 3: TALLERES (PLAN DE ESTUDIOS Y GESTIÓN) */}
      {activeTab === 'talleres' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
        >
          <View style={{ paddingHorizontal: gutter, paddingTop: space.md, gap: space.md }}>
            <View style={s.sectionTitleRow}>
              <View>
                <Text variant="kicker" style={{ color: colors.accent }}>
                  Plan de Estudios
                </Text>
                <Text variant="title" style={{ color: colors.ink, fontWeight: '800' }}>
                  Talleres Disponibles
                </Text>
              </View>

              <Button
                title="+ Taller"
                size="sm"
                variant="primary"
                onPress={handleOpenWorkshopModal}
              />
            </View>

            {/* Lista de tarjetas de talleres */}
            <View style={s.workshopGrid}>
              {workshops.map((w) => (
                <WorkshopCard
                  key={w.id}
                  workshop={w}
                  isSelected={w.id === selectedWorkshopId}
                  enrolledCount={workshopEnrollmentCounts[w.id] ?? 0}
                  onSelect={(id) => {
                    setSelectedWorkshopId(id);
                    toast.info(`Taller seleccionado: ${w.name}`);
                  }}
                  onDelete={handleDeleteWorkshop}
                />
              ))}
            </View>

            {/* Lista de estudiantes en el taller activo */}
            <View
              style={[
                s.activeEnrolledCard,
                {
                  backgroundColor: isDark ? '#16181C' : '#FFFFFF',
                  borderColor: isDark ? '#2F3336' : '#EFF3F4',
                },
              ]}
            >
              <View style={s.activeEnrolledHeader}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="kicker" style={{ color: colors.accent }}>
                    Inscripciones en Taller
                  </Text>
                  <Text variant="heading" style={{ color: colors.ink, fontWeight: '700' }}>
                    {selectedWorkshop.name}
                  </Text>
                </View>

                <Badge
                  label={`${(enrollments[selectedWorkshopId] ?? []).length} de ${selectedWorkshop.capacity}`}
                  tone="accent"
                />
              </View>

              <Divider />

              {(enrollments[selectedWorkshopId] ?? []).length === 0 ? (
                <EmptyState
                  icon="user-plus"
                  title="Sin alumnos en este taller"
                  message="Inscribe alumnos desde la pestaña Alumnos o toca un alumno para asignarlo."
                  actionLabel="Ir a Alumnos"
                  onAction={() => setActiveTab('alumnos')}
                />
              ) : (
                students
                  .filter((s) => (enrollments[selectedWorkshopId] ?? []).includes(s.id))
                  .map((student, idx) => (
                    <React.Fragment key={student.id}>
                      {idx > 0 && <Divider />}
                      <ListRow
                        title={student.name}
                        subtitle={student.course}
                        left={<Avatar name={student.name} size={38} />}
                        right={
                          <Button
                            title="Quitar"
                            size="sm"
                            variant="secondary"
                            onPress={() => handleToggleEnrollment(student.id)}
                          />
                        }
                      />
                    </React.Fragment>
                  ))
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {/* TAB 4: MÉTRICAS Y AJUSTES */}
      {activeTab === 'metricas' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
        >
          {/* Panel de métricas con tarjetas 2x2 */}
          <StatsPanel
            totalStudents={stats.total}
            activeStudents={stats.active}
            lessCrowdedWorkshop={stats.minW}
            mostCrowdedWorkshop={stats.maxW}
          />

          {/* Ranking de mejores puntuaciones */}
          <View style={{ paddingHorizontal: gutter, marginTop: space.lg }}>
            <View
              style={[
                s.settingCard,
                {
                  backgroundColor: isDark ? '#16181C' : '#FFFFFF',
                  borderColor: isDark ? '#2F3336' : '#EFF3F4',
                },
              ]}
            >
              <Text variant="kicker" style={{ color: colors.accent }}>
                Rendimiento Destacado
              </Text>
              <Text variant="heading" style={{ color: colors.ink, fontWeight: '700' }}>
                Mejores Puntuaciones de Alumnos
              </Text>

              {[...students]
                .sort((a, b) => b.level - a.level)
                .slice(0, 5)
                .map((student, idx) => (
                  <View key={student.id} style={s.leaderboardRow}>
                    <Text
                      variant="label"
                      style={{
                        width: 24,
                        fontWeight: '800',
                        color: idx === 0 ? colors.accent : colors.muted,
                      }}
                    >
                      #{idx + 1}
                    </Text>
                    <Avatar name={student.name} size={36} />
                    <View style={{ flex: 1 }}>
                      <Text variant="label" style={{ color: colors.ink }}>
                        {student.name}
                      </Text>
                      <Text variant="caption" style={{ color: colors.muted }}>
                        {student.course}
                      </Text>
                    </View>
                    <Badge
                      label={`${student.level} pts`}
                      tone={idx === 0 ? 'accent' : 'neutral'}
                    />
                  </View>
                ))}
            </View>
          </View>

          {/* Ajustes y Modo Oscuro/Claro */}
          <View style={{ paddingHorizontal: gutter, marginTop: space.md }}>
            <View
              style={[
                s.settingCard,
                {
                  backgroundColor: isDark ? '#16181C' : '#FFFFFF',
                  borderColor: isDark ? '#2F3336' : '#EFF3F4',
                },
              ]}
            >
              <Text variant="kicker" style={{ color: colors.accent }}>
                Sistema y Apariencia
              </Text>
              <Text variant="heading" style={{ color: colors.ink, fontWeight: '700' }}>
                Configuración Visual
              </Text>

              <View style={s.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text variant="label" style={{ color: colors.ink }}>
                    Modo Oscuro (Estilo X)
                  </Text>
                  <Text variant="caption" style={{ color: colors.muted }}>
                    Alterna entre tema claro y tema oscuro OLED con alto contraste
                  </Text>
                </View>
                <CustomSwitch
                  value={isDark}
                  onValueChange={toggleTheme}
                  accessibilityLabel="Alternar modo oscuro"
                />
              </View>

              <Divider />

              <View style={s.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text variant="label" style={{ color: colors.ink }}>
                    Servidor Backend
                  </Text>
                  <Text variant="caption" style={{ color: colors.muted }}>
                    http://localhost:3001 (NestJS + TypeORM)
                  </Text>
                </View>
                <Button
                  title="Comprobar"
                  size="sm"
                  variant="secondary"
                  onPress={onRefresh}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Barra de pestañas inferior estilo Cashbank */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modal para Crear Alumno o Taller */}
      <NewItemModal
        visible={modalVisible}
        mode={modalMode}
        studentName={newStudentName}
        studentCourse={newStudentCourse}
        workshopName={newWorkshopName}
        workshopInstructor={newWorkshopInstructor}
        onClose={() => setModalVisible(false)}
        onStudentNameChange={setNewStudentName}
        onStudentCourseChange={setNewStudentCourse}
        onWorkshopNameChange={setNewWorkshopName}
        onWorkshopInstructorChange={setNewWorkshopInstructor}
        onSave={handleSaveModal}
      />

      {/* Notificaciones Toaster flotantes */}
      <Toaster />
    </Screen>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingBottom: space.xxxl,
    gap: space.md,
  },
  lessonCard: {
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    gap: space.md,
  },
  lessonTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: space.md,
  },
  timerRing: {
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarTrack: {
    height: 7,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: gutter,
    marginBottom: space.xs,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  timeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  workshopGrid: {
    width: '100%',
  },
  activeEnrolledCard: {
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    gap: space.md,
  },
  activeEnrolledHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingCard: {
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    gap: space.md,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.xs,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.xs,
  },
});
