import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, 
  Heart, 
  FileText, 
  Shield, 
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  User,
  Bell
} from 'lucide-react-native';

export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logged out') }
      ]
    );
  };

  const handleMenuPress = (item: string) => {
    console.log('Menu item pressed:', item);
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => handleMenuPress('settings')}
          >
            <Settings size={24} color={isDarkMode ? '#FFFFFF' : '#1C1C1E'} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Sarah Johnson</Text>
          <Text style={styles.userEmail}>sarah.johnson@email.com</Text>
          <Text style={styles.memberSince}>Member since January 2024</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>47</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuPress('favorites')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#FF3040' }]}>
                  <Heart size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.menuItemText}>My Favorites</Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#8E8E93' : '#C7C7CC'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuContainer}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: isDarkMode ? '#5856D6' : '#5856D6' }]}>
                  {isDarkMode ? <Moon size={20} color="#FFFFFF" /> : <Sun size={20} color="#FFFFFF" />}
                </View>
                <Text style={styles.menuItemText}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#FF9500' }]}>
                  <Bell size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuPress('account')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#8E8E93' }]}>
                  <User size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.menuItemText}>Account Settings</Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#8E8E93' : '#C7C7CC'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuPress('terms')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#AF52DE' }]}>
                  <FileText size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.menuItemText}>Terms and Conditions</Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#8E8E93' : '#C7C7CC'} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuPress('privacy')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#FF6B35' }]}>
                  <Shield size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.menuItemText}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#8E8E93' : '#C7C7CC'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#FF3040" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#000000' : '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editAvatarText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: isDarkMode ? '#8E8E93' : '#8E8E93',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDarkMode ? '#8E8E93' : '#8E8E93',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    paddingVertical: 20,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDarkMode ? '#8E8E93' : '#8E8E93',
  },
  statDivider: {
    width: 1,
    backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E5EA',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#2C2C2E' : '#E5E5EA',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF3040',
  },
  bottomSpacer: {
    height: 100,
  },
});