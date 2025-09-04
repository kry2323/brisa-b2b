import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { t } from '../utils/translations';

interface PasswordUpdateScreenProps {
  navigation: any;
  route: any;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

const PasswordUpdateScreen: React.FC<PasswordUpdateScreenProps> = ({ navigation, route }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Get username from route params or use default
  const username = route?.params?.username || 'cisuser';

  // Password validation function
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return t('screens.passwordUpdate.validationMessages.passwordTooShort');
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return t('screens.passwordUpdate.validationMessages.passwordTooWeak');
    }
    
    return null;
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Current password validation
    if (!currentPassword.trim()) {
      newErrors.currentPassword = t('screens.passwordUpdate.validationMessages.currentPasswordRequired');
    }

    // New password validation
    if (!newPassword.trim()) {
      newErrors.newPassword = t('screens.passwordUpdate.validationMessages.newPasswordRequired');
    } else {
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      } else if (currentPassword && newPassword === currentPassword) {
        newErrors.newPassword = t('screens.passwordUpdate.validationMessages.newPasswordSameAsCurrent');
      }
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t('screens.passwordUpdate.validationMessages.confirmPasswordRequired');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('screens.passwordUpdate.validationMessages.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate validation - replace with actual validation
      if (currentPassword === 'wrongpassword') {
        setErrors({ currentPassword: t('screens.passwordUpdate.validationMessages.currentPasswordIncorrect') });
        setIsLoading(false);
        return;
      }

      // Success case
      Alert.alert(
        t('common.success'),
        t('screens.passwordUpdate.successMessage'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              // Clear form
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setErrors({});
              // Navigate back or to another screen
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      setErrors({ general: t('screens.passwordUpdate.errorMessage') });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigation.goBack();
  };

  // Handle navigation to report screens
  const handleNavigateToReport = (reportData: any) => {
    setIsReportsModalOpen(false);
    
    // Navigate based on report ID using React Navigation
    switch (reportData.id) {
      case 'financial-reports':
        navigation.navigate('FinancialReports', { reportData });
        break;
      case 'brisa-payments':
        navigation.navigate('BrisaPayments', { reportData });
        break;
      case 'overdue-report':
        navigation.navigate('OverdueReport', { reportData });
        break;
      case 'account-transactions':
        navigation.navigate('AccountTransactions', { reportData });
        break;
      case 'shipments-documents':
        navigation.navigate('ShipmentsDocuments', { reportData });
        break;
      case 'sales-report':
        navigation.navigate('SalesReport', { reportData });
        break;
      case 'order-monitoring':
        navigation.navigate('OrderMonitoring', { reportData });
        break;
      case 'tyres-on-the-way':
        navigation.navigate('TyresOnTheWay', { reportData });
        break;
      case 'pos-material-tracking':
        navigation.navigate('POSMaterialTracking', { reportData });
        break;
      case 'lassa-team':
        navigation.navigate('LassaTeam', { reportData });
        break;
      default:
        console.log('Unknown report type');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#2D5A27" />
              <Text style={styles.backButtonText}>{t('common.back')}</Text>
            </TouchableOpacity>

            {/* Breadcrumb */}
            <View style={styles.breadcrumb}>
              <Text style={styles.breadcrumbText}>Home > {t('screens.passwordUpdate.title')}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{t('screens.passwordUpdate.title')}</Text>

            {/* Form */}
            <View style={styles.form}>
              {/* Username Field (Read-only) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('screens.passwordUpdate.username')}</Text>
                <TextInput
                  style={[styles.input, styles.readOnlyInput]}
                  value={username}
                  editable={false}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Current Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('screens.passwordUpdate.currentPassword')}</Text>
                <TextInput
                  style={[styles.input, errors.currentPassword && styles.inputError]}
                  placeholder={t('screens.passwordUpdate.currentPasswordPlaceholder')}
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    if (errors.currentPassword) {
                      setErrors({ ...errors, currentPassword: undefined });
                    }
                  }}
                />
                {errors.currentPassword && (
                  <Text style={styles.errorText}>{errors.currentPassword}</Text>
                )}
              </View>

              {/* New Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('screens.passwordUpdate.newPassword')}</Text>
                <TextInput
                  style={[styles.input, errors.newPassword && styles.inputError]}
                  placeholder={t('screens.passwordUpdate.newPasswordPlaceholder')}
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (errors.newPassword) {
                      setErrors({ ...errors, newPassword: undefined });
                    }
                  }}
                />
                {errors.newPassword && (
                  <Text style={styles.errorText}>{errors.newPassword}</Text>
                )}
              </View>

              {/* Confirm New Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('screens.passwordUpdate.confirmNewPassword')}</Text>
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  placeholder={t('screens.passwordUpdate.confirmPasswordPlaceholder')}
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>

              {/* General Error Message */}
              {errors.general && (
                <View style={styles.generalErrorContainer}>
                  <Text style={styles.generalErrorText}>{errors.general}</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>{t('screens.passwordUpdate.cancelButton')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.updateButton, isLoading && styles.buttonDisabled]}
                  onPress={handleUpdatePassword}
                  disabled={isLoading}
                >
                  <Text style={styles.updateButtonText}>
                    {isLoading ? t('common.loading') : t('screens.passwordUpdate.updateButton')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Navigation Links */}
            <View style={styles.navigationSection}>
              <Text style={styles.navigationTitle}>Quick Navigation</Text>
              <View style={styles.navigationGrid}>
                <TouchableOpacity 
                  style={styles.navigationCard}
                  onPress={() => navigation.navigate('Dashboard')}
                >
                  <Ionicons name="home-outline" size={24} color="#2D5A27" />
                  <Text style={styles.navigationCardText}>Home</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.navigationCard}
                  onPress={() => navigation.navigate('ProductListing')}
                >
                  <Ionicons name="grid-outline" size={24} color="#2D5A27" />
                  <Text style={styles.navigationCardText}>Products</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.navigationCard}
                  onPress={() => navigation.navigate('Cart')}
                >
                  <Ionicons name="cart-outline" size={24} color="#2D5A27" />
                  <Text style={styles.navigationCardText}>Cart</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.navigationCard}
                  onPress={() => navigation.navigate('MyWishList')}
                >
                  <Ionicons name="heart-outline" size={24} color="#2D5A27" />
                  <Text style={styles.navigationCardText}>Wishlist</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.navigationCard}
                  onPress={() => navigation.navigate('VideoLibrary')}
                >
                  <Ionicons name="play-circle-outline" size={24} color="#2D5A27" />
                  <Text style={styles.navigationCardText}>Videos</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.navigationCard}
                  onPress={() => navigation.navigate('LassaTeam')}
                >
                  <Ionicons name="people-outline" size={24} color="#2D5A27" />
                  <Text style={styles.navigationCardText}>Team</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Footer />
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen} 
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={handleNavigateToReport}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    width: '100%',
    minHeight: 500,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2D5A27',
    fontWeight: '600',
  },
  breadcrumb: {
    marginBottom: 16,
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5A27', // Dark green color as shown in the image
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#064F4F',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  readOnlyInput: {
    backgroundColor: '#F5F5F5',
    color: '#999',
  },
  inputError: {
    borderColor: '#D53439',
  },
  errorText: {
    color: '#D53439',
    fontSize: 14,
    marginTop: 4,
  },
  generalErrorContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  generalErrorText: {
    color: '#D53439',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#669A67',
  },
  updateButton: {
    backgroundColor: '#669A67',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '400',
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '400',
  },
  navigationSection: {
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5A27',
    marginBottom: 16,
    textAlign: 'center',
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  navigationCard: {
    width: '30%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  navigationCardText: {
    marginTop: 8,
    fontSize: 12,
    color: '#2D5A27',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PasswordUpdateScreen;
