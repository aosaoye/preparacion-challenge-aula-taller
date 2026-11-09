import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const workshopCards = [
  { id: 1, title: 'Física', instructor: 'Dr. Emily Carter', color: '#dff7e8', dot: '#f59e0b', free: 14 },
  { id: 2, title: 'Química', instructor: 'Dr. Carla Díaz', color: '#dfeafc', dot: '#60a5fa', free: 3 },
];

const leaderboard = [
  { name: 'Ana', score: 92, color: '#f59e0b', initial: 'AL' },
  { name: 'Daniel', score: 81, color: '#f3f4f6', initial: 'DG' },
  { name: 'Clara', score: 76, color: '#f3f4f6', initial: 'CV' },
];

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.background} />

      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.deviceFrame}>
          <View style={styles.phoneShellLight}>
            <View style={styles.statusRowLight}>
              <Text style={styles.statusTextLight}>9:36</Text>
              <View style={styles.statusIconsLight}>
                <Text style={styles.dotLight}>◉</Text>
                <Text style={styles.dotLight}>◉</Text>
                <Text style={styles.dotLight}>◉</Text>
              </View>
            </View>

            <View style={styles.lightPanel}>
              <View style={styles.lightHeader}>
                <View>
                  <Text style={styles.dayLabel}>Fri</Text>
                  <Text style={styles.dayValue}>15</Text>
                </View>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>◌</Text>
                </View>
              </View>

              <View style={styles.cardLesson}>
                <Text style={styles.lessonLabel}>The next lesson</Text>
                <View style={styles.lessonHeader}>
                  <Text style={styles.subjectTitle}>Matemáticas</Text>
                  <View style={styles.timerRing}>
                    <Text style={styles.timerText}>4 min</Text>
                  </View>
                </View>
                <Text style={styles.timeLabel}>TIME:</Text>
                <Text style={styles.timeValue}>10:00 - 10:45</Text>
                <View style={styles.ctaWrap}>
                  <Pressable style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Go</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.scheduleList}>
                {[
                  { time: '10:00 - 10:45', title: 'Physics', teacher: 'Dr. Emily Carter', duration: '15 min' },
                  { time: '11:00 - 11:45', title: 'Chemistry', teacher: 'Dr. Alex Thompson', duration: '15 min' },
                ].map((item) => (
                  <View key={item.title} style={styles.scheduleItem}>
                    <Text style={styles.scheduleTime}>{item.time}</Text>
                    <View style={styles.scheduleMeta}>
                      <Text style={styles.scheduleTitle}>{item.title}</Text>
                      <Text style={styles.scheduleTeacher}>{item.teacher}</Text>
                    </View>
                    <Text style={styles.scheduleDuration}>{item.duration}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.navBar}>
                {['◧', '◫', '◩', '◭'].map((icon, index) => (
                  <Pressable key={icon + index} style={[styles.navIcon, index === 0 && styles.navIconActive]}>
                    <Text style={[styles.navText, index === 0 && styles.navTextActive]}>{icon}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.phoneShellDark}>
            <View style={styles.statusRowDark}>
              <Text style={styles.statusTextDark}>9:36</Text>
              <View style={styles.statusIconsDark}>
                <Text style={styles.dotDark}>◉</Text>
                <Text style={styles.dotDark}>◉</Text>
                <Text style={styles.dotDark}>◉</Text>
              </View>
            </View>

            <View style={styles.darkPanel}>
              <View style={styles.darkHeader}>
                <Text style={styles.backText}>{'<'}</Text>
                <Text style={styles.courseTitle}>Training course</Text>
                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>◫</Text>
                </View>
              </View>

              <View style={styles.courseCard}>
                <View style={styles.courseHeaderRow}>
                  <Text style={styles.courseName}>Matemáticas</Text>
                  <Text style={styles.courseBadge}>Course</Text>
                </View>
                <Text style={styles.instructorText}>Dr. Ana Flores</Text>
                <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View>
                <Text style={styles.progressText}>◔ 12 day</Text>
              </View>

              <Text style={styles.leaderboardTitle}>Leaderboard</Text>

              <View style={styles.barsRow}>
                {leaderboard.map((person, index) => (
                  <View key={person.name} style={styles.barCol}>
                    <View style={styles.barSlot}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: 100 + index * 20,
                            backgroundColor: person.color === '#f59e0b' ? '#f59e0b' : '#f3f4f6',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barScore}>{person.score}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.peopleRow}>
                {leaderboard.map((person, index) => (
                  <View key={`${person.name}-meta`} style={styles.personMeta}>
                    <Text style={styles.personRank}>#{index + 1}</Text>
                    <View style={[styles.avatar, person.color === '#f59e0b' && styles.avatarActive]}>
                      <Text style={styles.avatarText}>{person.initial}</Text>
                    </View>
                    <Text style={styles.personName}>{person.name}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>8</Text>
                  <Text style={styles.statLabel}>Total lesson</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>5</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>4</Text>
                  <Text style={styles.statLabel}>In progress</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.managementCard}>
          <View style={styles.managementHeader}>
            <Text style={styles.managementTitle}>Gestión de talleres</Text>
            <View style={styles.actionRow}>
              <Pressable style={styles.primaryAction}>
                <Text style={styles.primaryActionText}>+ Alumno</Text>
              </Pressable>
              <Pressable style={styles.secondaryAction}>
                <Text style={styles.secondaryActionText}>+ Taller</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.workshopGrid}>
            {workshopCards.map((item) => (
              <View key={item.id} style={[styles.workshopCard, { backgroundColor: item.color }]}>
                <View style={styles.workshopHead}>
                  <Text style={styles.workshopTitle}>{item.title}</Text>
                  <Text style={styles.workshopBadge}>{item.free} libres</Text>
                </View>
                <Text style={styles.workshopTeacher}>{item.instructor}</Text>
                <View style={styles.workshopFooter}>
                  <View style={[styles.workshopDot, { backgroundColor: item.dot }]} />
                  <Text style={styles.workshopFooterText}>{item.free}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#0f1113',
  },
  page: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  deviceFrame: {
    width: '100%',
    maxWidth: 780,
    backgroundColor: '#171a1d',
    borderRadius: 42,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 10,
  },
  phoneShellLight: {
    width: 330,
    height: 670,
    backgroundColor: '#1d1d1d',
    borderRadius: 36,
    paddingTop: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#2a2d31',
  },
  phoneShellDark: {
    width: 330,
    height: 670,
    backgroundColor: '#1d1d1d',
    borderRadius: 36,
    paddingTop: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#2a2d31',
  },
  statusRowLight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  statusRowDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  statusTextLight: {
    color: '#171717',
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextDark: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  statusIconsLight: {
    flexDirection: 'row',
    gap: 4,
  },
  statusIconsDark: {
    flexDirection: 'row',
    gap: 4,
  },
  dotLight: {
    color: '#171717',
    fontSize: 11,
  },
  dotDark: {
    color: '#fff',
    fontSize: 11,
  },
  lightPanel: {
    flex: 1,
    backgroundColor: '#f2f0ec',
    borderRadius: 30,
    padding: 18,
  },
  lightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayLabel: {
    color: '#6b7280',
    fontSize: 10,
  },
  dayValue: {
    color: '#171717',
    fontSize: 28,
    fontWeight: '800',
  },
  notificationBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#171717',
    fontSize: 18,
  },
  cardLesson: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 15,
    marginBottom: 16,
  },
  lessonLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  subjectTitle: {
    color: '#171717',
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: -1,
  },
  timerRing: {
    width: 62,
    height: 62,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#f5ae42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    color: '#171717',
    fontWeight: '700',
    fontSize: 12,
  },
  timeLabel: {
    color: '#7a7a7a',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 6,
  },
  timeValue: {
    color: '#171717',
    fontSize: 18,
    fontWeight: '700',
  },
  ctaWrap: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  primaryButton: {
    width: 52,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  scheduleList: {
    gap: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0efec',
    borderRadius: 14,
    padding: 10,
  },
  scheduleTime: {
    width: 78,
    color: '#171717',
    fontSize: 11,
    fontWeight: '700',
  },
  scheduleMeta: {
    flex: 1,
  },
  scheduleTitle: {
    color: '#171717',
    fontSize: 14,
    fontWeight: '700',
  },
  scheduleTeacher: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 2,
  },
  scheduleDuration: {
    color: '#171717',
    fontWeight: '700',
    fontSize: 12,
  },
  navBar: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e1dc',
  },
  navIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f2f0ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconActive: {
    backgroundColor: '#f59e0b',
  },
  navText: {
    color: '#171717',
    fontSize: 16,
  },
  navTextActive: {
    color: '#fff',
  },
  darkPanel: {
    flex: 1,
    backgroundColor: '#1d1e1e',
    borderRadius: 30,
    padding: 18,
  },
  darkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '500',
  },
  courseTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 15,
  },
  courseCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  courseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseName: {
    color: '#fff',
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -1,
  },
  courseBadge: {
    backgroundColor: '#f59e0b',
    color: '#171717',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 10,
    fontWeight: '700',
  },
  instructorText: {
    color: '#d8d8d8',
    fontSize: 12,
    marginBottom: 12,
  },
  progressTrack: {
    height: 12,
    backgroundColor: '#3a3a3a',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    width: '78%',
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 999,
  },
  progressText: {
    color: '#d8d8d8',
    fontSize: 11,
    textAlign: 'right',
  },
  leaderboardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 18,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    marginBottom: 12,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barSlot: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 44,
    borderRadius: 18,
  },
  barScore: {
    color: '#e5e5e5',
    fontSize: 11,
    marginTop: 10,
  },
  peopleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  personMeta: {
    flex: 1,
    alignItems: 'center',
  },
  personRank: {
    color: '#d4d4d4',
    fontSize: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarActive: {
    backgroundColor: '#f59e0b',
  },
  avatarText: {
    color: '#171717',
    fontWeight: '700',
    fontSize: 9,
  },
  personName: {
    color: '#fff',
    fontSize: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  statLabel: {
    color: '#d4d4d4',
    fontSize: 10,
    textAlign: 'center',
  },
  managementCard: {
    width: '100%',
    maxWidth: 780,
    backgroundColor: '#f4f2ee',
    borderRadius: 32,
    padding: 18,
    marginTop: 26,
    shadowColor: '#c4b5a8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 4,
  },
  managementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  managementTitle: {
    color: '#171717',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryAction: {
    backgroundColor: '#171717',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryActionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  secondaryAction: {
    backgroundColor: '#efeae4',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5dfd7',
  },
  secondaryActionText: {
    color: '#171717',
    fontWeight: '700',
    fontSize: 12,
  },
  workshopGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  workshopCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    minHeight: 110,
  },
  workshopHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workshopTitle: {
    color: '#171717',
    fontSize: 20,
    fontWeight: '800',
  },
  workshopBadge: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: '700',
    color: '#171717',
  },
  workshopTeacher: {
    color: '#4b5563',
    fontSize: 12,
    marginBottom: 16,
  },
  workshopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workshopDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  workshopFooterText: {
    color: '#171717',
    fontWeight: '700',
    fontSize: 12,
  },
});
