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
  FilterPill,
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
  colors,
  CustomSwitch,
  Divider,
  EmptyState,
  Field,
  gutter,
  IconButton,
  ListRow,
  radius,
  Screen,
  ScreenHeader,
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
  const { isDark, toggleTheme } = useTheme();

  // State
  const [activeTab, setActiveTab] = useState<TabKey>('aula');
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
    <Screen edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Screen 1: AULA (Overview & Dashboard) */}
      {activeTab === 'aula' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        >
          <ScreenHeader
            kicker="Centro Educativo"
            title="Aula Virtual"
            right={
              <View style={s.headerActions}>
                <Button title="+ Alumno" size="sm" variant="primary" onPress={handleOpenStudentModal} />
                <Button title="+ Taller" size="sm" variant="secondary" onPress={handleOpenWorkshopModal} />
              </View>
            }
          />

          {/* Featured Next Lesson Card */}
          <View style={{ paddingHorizontal: gutter }}>
            <Card tone="accent" style={s.lessonCard}>
              <View style={s.lessonTop}>
                <View>
                  <Text variant="kicker">Siguiente sesión activa</Text>
                  <Text variant="title" style={{ marginTop: 2 }}>{selectedWorkshop.name}</Text>
                  <Text variant="caption" style={{ color: colors.muted, marginTop: 2 }}>
                    Instructor: {selectedWorkshop.instructor}
                  </Text>
                </View>
                <View style={s.timerRing}>
                  <Text variant="label" style={{ color: colors.accent, fontWeight: '800' }}>4 min</Text>
                </View>
              </View>

              <View style={s.lessonMetaRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Feather name="clock" size={14} color={colors.muted} />
                  <Text variant="caption">10:00 - 10:45</Text>
                </View>
                <Badge
                  label={`${selectedWorkshop.capacity - (workshopEnrollmentCounts[selectedWorkshop.id] ?? 0)} plazas libres`}
                  tone="accent"
                />
              </View>

              {/* Progress bar */}
              <View style={s.progressBarTrack}>
                <View
                  style={[
                    s.progressBarFill,
                    {
                      width: `${Math.min(100, ((workshopEnrollmentCounts[selectedWorkshop.id] ?? 0) / selectedWorkshop.capacity) * 100)}%`,
                    },
                  ]}
                />
              </View>
            </Card>
          </View>

          {/* Talleres Carousel */}
          <Section
            title="Talleres del Curso"
            action={
              <Pressable onPress={() => setActiveTab('talleres')}>
                <Text variant="caption" style={{ color: colors.accent, fontWeight: '700' }}>
                  Ver todos ({workshops.length})
                </Text>
              </Pressable>
            }
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: gutter, gap: space.md }}
            >
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
            </ScrollView>
          </Section>

          {/* Quick Schedule */}
          <View style={{ paddingHorizontal: gutter, gap: space.sm }}>
            <Text variant="heading">Horario del Día</Text>
            {[
              { time: '10:00 - 10:45', title: selectedWorkshop.name, teacher: selectedWorkshop.instructor, dur: '45 min' },
              { time: '11:00 - 11:45', title: 'Matemáticas y Análisis', teacher: 'Dr. Marco Lee', dur: '45 min' },
              { time: '12:00 - 12:45', title: 'Laboratorio de Pruebas', teacher: 'Dra. Carla Díaz', dur: '45 min' },
            ].map((item, idx) => (
              <Card key={idx} tone="soft" style={s.scheduleRow}>
                <View style={s.timeBadge}>
                  <Text variant="caption" style={{ fontWeight: '700', color: colors.ink }}>{item.time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="label">{item.title}</Text>
                  <Text variant="caption" style={{ color: colors.muted }}>{item.teacher}</Text>
                </View>
                <Badge label={item.dur} tone="neutral" />
              </Card>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Screen 2: ALUMNOS */}
      {activeTab === 'alumnos' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        >
          <ScreenHeader
            kicker="Directorio"
            title="Alumnos"
            right={
              <Button title="+ Alumno" size="sm" variant="primary" onPress={handleOpenStudentModal} />
            }
          />

          {/* Filter Chips */}
          <ChipRow
            options={filterOptions}
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
          />

          <View style={{ paddingHorizontal: gutter }}>
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
          </View>
        </ScrollView>
      )}

      {/* Screen 3: TALLERES */}
      {activeTab === 'talleres' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        >
          <ScreenHeader
            kicker="Plan de Estudios"
            title="Talleres"
            right={
              <Button title="+ Taller" size="sm" variant="primary" onPress={handleOpenWorkshopModal} />
            }
          />

          <View style={{ paddingHorizontal: gutter, gap: space.md }}>
            <Text variant="body" style={{ color: colors.muted }}>
              Selecciona un taller para revisar su información y la lista de estudiantes inscritos.
            </Text>

            <View style={s.workshopGrid}>
              {workshops.map((w) => (
                <WorkshopCard
                  key={w.id}
                  workshop={w}
                  isSelected={w.id === selectedWorkshopId}
                  enrolledCount={workshopEnrollmentCounts[w.id] ?? 0}
                  onSelect={(id) => setSelectedWorkshopId(id)}
                  onDelete={handleDeleteWorkshop}
                />
              ))}
            </View>

            {/* Enrolled students in selected workshop */}
            <Card tone="soft" style={{ gap: space.md, marginTop: space.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text variant="kicker">Inscripciones Activas</Text>
                  <Text variant="heading">{selectedWorkshop.name}</Text>
                </View>
                <Badge
                  label={`${(enrollments[selectedWorkshopId] ?? []).length} alumnos`}
                  tone="accent"
                />
              </View>

              <Divider />

              {(enrollments[selectedWorkshopId] ?? []).length === 0 ? (
                <EmptyState
                  icon="user-plus"
                  title="Sin alumnos inscritos"
                  message="Inscribe alumnos desde la pestaña de Alumnos."
                  actionLabel="Ir a Alumnos"
                  onAction={() => setActiveTab('alumnos')}
                />
              ) : (
                students
                  .filter((s) => (enrollments[selectedWorkshopId] ?? []).includes(s.id))
                  .map((student) => (
                    <ListRow
                      key={student.id}
                      title={student.name}
                      subtitle={student.course}
                      left={<Avatar name={student.name} size={36} />}
                      right={
                        <Button
                          title="Quitar"
                          size="sm"
                          variant="ghost"
                          onPress={() => handleToggleEnrollment(student.id)}
                        />
                      }
                    />
                  ))
              )}
            </Card>
          </View>
        </ScrollView>
      )}

      {/* Screen 4: MÉTRICAS Y AJUSTES */}
      {activeTab === 'metricas' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
        >
          <ScreenHeader
            kicker="Panel Analítico"
            title="Métricas"
          />

          <View style={{ paddingHorizontal: gutter, gap: space.lg }}>
            <StatsPanel
              totalStudents={stats.total}
              activeStudents={stats.active}
              lessCrowdedWorkshop={stats.minW}
              mostCrowdedWorkshop={stats.maxW}
            />

            {/* Leaderboard */}
            <Card tone="soft" style={{ gap: space.md }}>
              <Text variant="kicker">Rendimiento Destacado</Text>
              <Text variant="heading">Mejores Puntuaciones</Text>

              {[...students]
                .sort((a, b) => b.level - a.level)
                .slice(0, 5)
                .map((student, idx) => (
                  <View key={student.id} style={s.leaderboardRow}>
                    <Text variant="label" style={{ width: 24, fontWeight: '800', color: colors.accent }}>
                      #{idx + 1}
                    </Text>
                    <Avatar name={student.name} size={34} />
                    <View style={{ flex: 1 }}>
                      <Text variant="label">{student.name}</Text>
                      <Text variant="caption">{student.course}</Text>
                    </View>
                    <Badge label={`${student.level} pts`} tone={idx === 0 ? 'accent' : 'neutral'} />
                  </View>
                ))}
            </Card>

            {/* Settings & Appearance */}
            <Card tone="soft" style={{ gap: space.md }}>
              <Text variant="kicker">Configuración</Text>
              <Text variant="heading">Apariencia y Sistema</Text>

              <View style={s.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text variant="label">Modo Oscuro</Text>
                  <Text variant="caption" style={{ color: colors.muted }}>
                    Alterna entre tema claro y tema oscuro (estilo X/Twitter)
                  </Text>
                </View>
                <CustomSwitch
                  value={isDark}
                  onValueChange={toggleTheme}
                  accessibilityLabel="Modo oscuro"
                />
              </View>

              <Divider />

              <View style={s.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text variant="label">Servidor Backend</Text>
                  <Text variant="caption" style={{ color: colors.muted }}>
                    http://localhost:3001 (NestJS + TypeORM)
                  </Text>
                </View>
                <Button title="Probar" size="sm" variant="secondary" onPress={onRefresh} />
              </View>
            </Card>
          </View>
        </ScrollView>
      )}

      {/* Floating Bottom Tab Bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modal for adding Student or Workshop */}
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
    gap: space.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  lessonCard: {
    gap: space.md,
  },
  lessonTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timerRing: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  lessonMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.line,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.md,
  },
  timeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  workshopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.md,
    justifyContent: 'space-between',
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
