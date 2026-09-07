import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../theme';

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  people: 'People',
  dates: 'Dates',
  settings: 'Settings',
};

const MENU_ITEMS = [
  { key: 'new-note', label: 'New Note', route: '/new-note' as const },
  { key: 'new-person', label: 'New Person', route: '/new-person' as const },
  { key: 'new-date', label: 'New Date', route: '/new-date' as const },
];

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const label = TAB_LABELS[route.name] ?? route.name;
          return (
            <Pressable
              key={route.key}
              style={styles.tabItem}
              onPress={() => {
                if (!focused) navigation.navigate(route.name);
              }}
            >
              <View style={[styles.tabIcon, focused && styles.tabIconActive]} />
              <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
            </Pressable>
          );
        })}
        <Pressable
          style={[styles.fab, { bottom: 34 + Math.max(insets.bottom - 10, 0) }, menuOpen && styles.fabClose]}
          onPress={() => setMenuOpen((v) => !v)}
        >
          <Text style={styles.fabIcon}>{menuOpen ? '×' : '+'}</Text>
        </Pressable>
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
          <View style={[styles.menuStack, { paddingBottom: 100 + insets.bottom }]}>
            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item.key}
                style={styles.menuOption}
                onPress={() => {
                  setMenuOpen(false);
                  router.push(item.route);
                }}
              >
                <View style={styles.menuDot} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 11,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 5 },
  tabIcon: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.4,
    borderColor: colors.ink,
    opacity: 0.32,
  },
  tabIconActive: {
    opacity: 1,
    backgroundColor: colors.ink,
  },
  tabLabel: { fontFamily: fonts.sans, fontSize: 9, color: colors.ink, opacity: 0.4 },
  tabLabelActive: { opacity: 1, fontFamily: fonts.sansSemiBold },
  fab: {
    position: 'absolute',
    left: '50%',
    marginLeft: -26,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.3,
    borderColor: colors.paper,
  },
  fabClose: { backgroundColor: colors.ink },
  fabIcon: { color: colors.white, fontSize: 27, lineHeight: 30 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(35,36,31,0.55)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  menuStack: { alignItems: 'center', gap: 12 },
  menuOption: {
    width: 170,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1.3,
    borderColor: colors.outlineDash,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  menuDot: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: colors.fill,
    borderWidth: 1.2,
    borderColor: colors.outlineDash,
  },
  menuLabel: { fontFamily: fonts.sansMedium, fontSize: 13.5, color: colors.ink },
});
