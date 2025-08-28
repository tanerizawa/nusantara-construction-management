import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { useNotification } from '../context/NotificationContext';

export default function ProfileScreen({ navigation }) {
  const { user, updateProfile, logout } = useAuth();
  const { isConnected } = useOffline();
  const { hasPermission, requestPermission, notificationSettings, updateNotificationSettings } = useNotification();
  const [profileData, setProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeProfile();
  }, [user]);

  const initializeProfile = () => {
    // Mock extended profile data
    const extendedProfile = {
      ...user,
      department: 'Construction',
      position: 'Site Manager',
      employeeId: 'EMP-001',
      joinDate: '2023-01-15',
      phone: '08123456789',
      address: 'Jl. Sudirman No. 123, Jakarta Selatan',
      emergencyContact: {
        name: 'Sarah Santoso',
        relationship: 'Spouse',
        phone: '08123456788'
      },
      skills: ['Project Management', 'Construction Safety', 'Team Leadership'],
      certifications: ['PMP', 'OSHA 30-Hour', 'First Aid'],
      languages: ['Indonesian', 'English'],
      performanceScore: 4.5,
      attendanceRate: 95,
      completedProjects: 12,
      totalExperience: '8 years'
    };
    setProfileData(extendedProfile);
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required to change profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await updateProfile(profileData);
      setIsEditing(false);
      
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const ProfileField = ({ label, value, icon, editable = false, multiline = false, onChangeText }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon} size={16} color="#6B7280" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      {isEditing && editable ? (
        <TextInput
          style={[styles.fieldInput, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Not set'}</Text>
      )}
    </View>
  );

  const StatCard = ({ icon, label, value, color = '#3B82F6' }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={isEditing ? handleImagePicker : null}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>
                  {profileData.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </Text>
              </View>
            )}
            {isEditing && (
              <View style={styles.imageOverlay}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileTitle}>{profileData.position}</Text>
          <Text style={styles.profileId}>{profileData.employeeId}</Text>
          
          {!isConnected && (
            <View style={styles.offlineIndicator}>
              <Ionicons name="cloud-offline" size={16} color="#F59E0B" />
              <Text style={styles.offlineText}>Offline Mode</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  initializeProfile();
                }}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
                <Text style={[styles.actionButtonText, { color: '#6B7280' }]}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.settingsButton]}
                onPress={() => setShowSettings(true)}
              >
                <Ionicons name="settings-outline" size={20} color="#6B7280" />
                <Text style={[styles.actionButtonText, { color: '#6B7280' }]}>Settings</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Performance Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="star"
              label="Performance"
              value={`${profileData.performanceScore}/5`}
              color="#F59E0B"
            />
            <StatCard
              icon="checkmark-circle"
              label="Attendance"
              value={`${profileData.attendanceRate}%`}
              color="#10B981"
            />
            <StatCard
              icon="construct"
              label="Projects"
              value={profileData.completedProjects}
              color="#3B82F6"
            />
            <StatCard
              icon="time"
              label="Experience"
              value={profileData.totalExperience}
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.sectionContent}>
            <ProfileField
              label="Full Name"
              value={profileData.name}
              icon="person-outline"
              editable={true}
              onChangeText={(text) => setProfileData({ ...profileData, name: text })}
            />
            <ProfileField
              label="Email Address"
              value={profileData.email}
              icon="mail-outline"
              editable={true}
              onChangeText={(text) => setProfileData({ ...profileData, email: text })}
            />
            <ProfileField
              label="Phone Number"
              value={profileData.phone}
              icon="call-outline"
              editable={true}
              onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
            />
            <ProfileField
              label="Address"
              value={profileData.address}
              icon="location-outline"
              editable={true}
              multiline={true}
              onChangeText={(text) => setProfileData({ ...profileData, address: text })}
            />
          </View>
        </View>

        {/* Work Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Work Information</Text>
          <View style={styles.sectionContent}>
            <ProfileField
              label="Employee ID"
              value={profileData.employeeId}
              icon="id-card-outline"
            />
            <ProfileField
              label="Position"
              value={profileData.position}
              icon="briefcase-outline"
            />
            <ProfileField
              label="Department"
              value={profileData.department}
              icon="business-outline"
            />
            <ProfileField
              label="Join Date"
              value={new Date(profileData.joinDate).toLocaleDateString()}
              icon="calendar-outline"
            />
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.sectionContent}>
            <ProfileField
              label="Contact Name"
              value={profileData.emergencyContact?.name}
              icon="person-outline"
              editable={true}
              onChangeText={(text) => setProfileData({
                ...profileData,
                emergencyContact: { ...profileData.emergencyContact, name: text }
              })}
            />
            <ProfileField
              label="Relationship"
              value={profileData.emergencyContact?.relationship}
              icon="heart-outline"
              editable={true}
              onChangeText={(text) => setProfileData({
                ...profileData,
                emergencyContact: { ...profileData.emergencyContact, relationship: text }
              })}
            />
            <ProfileField
              label="Phone Number"
              value={profileData.emergencyContact?.phone}
              icon="call-outline"
              editable={true}
              onChangeText={(text) => setProfileData({
                ...profileData,
                emergencyContact: { ...profileData.emergencyContact, phone: text }
              })}
            />
          </View>
        </View>

        {/* Skills & Certifications */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Skills & Qualifications</Text>
          <View style={styles.sectionContent}>
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsLabel}>Skills:</Text>
              <View style={styles.tagsGrid}>
                {profileData.skills?.map((skill, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsLabel}>Certifications:</Text>
              <View style={styles.tagsGrid}>
                {profileData.certifications?.map((cert, index) => (
                  <View key={index} style={[styles.tag, styles.certTag]}>
                    <Text style={[styles.tagText, styles.certTagText]}>{cert}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsLabel}>Languages:</Text>
              <View style={styles.tagsGrid}>
                {profileData.languages?.map((lang, index) => (
                  <View key={index} style={[styles.tag, styles.langTag]}>
                    <Text style={[styles.tagText, styles.langTagText]}>{lang}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Text style={styles.modalDone}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Notification Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Notifications</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive push notifications for important updates
                  </Text>
                </View>
                <Switch
                  value={notificationSettings?.enabled || false}
                  onValueChange={(value) => updateNotificationSettings({ enabled: value })}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Leave Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Notifications for leave requests and approvals
                  </Text>
                </View>
                <Switch
                  value={notificationSettings?.leave || false}
                  onValueChange={(value) => updateNotificationSettings({ leave: value })}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Performance Reviews</Text>
                  <Text style={styles.settingDescription}>
                    Reminders for performance reviews and feedback
                  </Text>
                </View>
                <Switch
                  value={notificationSettings?.performance || false}
                  onValueChange={(value) => updateNotificationSettings({ performance: value })}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>AI Insights</Text>
                  <Text style={styles.settingDescription}>
                    AI-powered insights and recommendations
                  </Text>
                </View>
                <Switch
                  value={notificationSettings?.ai || false}
                  onValueChange={(value) => updateNotificationSettings({ ai: value })}
                />
              </View>
            </View>

            {/* Privacy Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Privacy</Text>
              
              <TouchableOpacity style={styles.settingButton}>
                <Ionicons name="shield-outline" size={20} color="#3B82F6" />
                <Text style={styles.settingButtonText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingButton}>
                <Ionicons name="document-text-outline" size={20} color="#3B82F6" />
                <Text style={styles.settingButtonText}>Terms of Service</Text>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* App Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>App</Text>
              
              <TouchableOpacity style={styles.settingButton}>
                <Ionicons name="information-circle-outline" size={20} color="#3B82F6" />
                <Text style={styles.settingButtonText}>About</Text>
                <Text style={styles.settingVersion}>v1.0.0</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingButton}>
                <Ionicons name="help-circle-outline" size={20} color="#3B82F6" />
                <Text style={styles.settingButtonText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 6,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  profileId: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingsButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 16,
    color: '#1F2937',
  },
  fieldInput: {
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EBF5FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  certTag: {
    backgroundColor: '#ECFDF5',
  },
  certTagText: {
    color: '#059669',
  },
  langTag: {
    backgroundColor: '#FEF3C7',
  },
  langTagText: {
    color: '#D97706',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 24,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalDone: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  settingButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  settingVersion: {
    fontSize: 14,
    color: '#6B7280',
  },
});
