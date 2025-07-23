import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

const DesignExamples = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchText, setSearchText] = useState('');

  const tabs = ['Kartlar', 'Butonlar', 'Formlar', 'Listeler', 'Modallar'];

  const handleButtonPress = (title: string) => {
    Alert.alert('Bilgi', `${title} tıklandı!`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasarım Örnekleri</Text>
        <Text style={styles.headerSubtitle}>Modern UI Bileşenleri</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Ara..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Tab Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              selectedTab === index && styles.activeTab
            ]}
            onPress={() => setSelectedTab(index)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === index && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content based on selected tab */}
      {selectedTab === 0 && <CardsSection />}
      {selectedTab === 1 && <ButtonsSection />}
      {selectedTab === 2 && <FormsSection />}
      {selectedTab === 3 && <ListsSection />}
      {selectedTab === 4 && <ModalsSection />}
    </ScrollView>
  );
};

// Cards Section
const CardsSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Kart Tasarımları</Text>
    
    {/* Basic Card */}
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>John Doe</Text>
          <Text style={styles.cardSubtitle}>Ürün Müdürü</Text>
        </View>
      </View>
      <Text style={styles.cardContent}>
        Bu bir örnek kart içeriğidir. Modern tasarım prensiplerini gösterir.
      </Text>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.cardButton}>
          <Text style={styles.cardButtonText}>Detaylar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cardButton, styles.cardButtonSecondary]}>
          <Text style={styles.cardButtonTextSecondary}>Düzenle</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Stats Card */}
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>1,234</Text>
        <Text style={styles.statLabel}>Toplam Satış</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>89%</Text>
        <Text style={styles.statLabel}>Başarı Oranı</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>45</Text>
        <Text style={styles.statLabel}>Aktif Proje</Text>
      </View>
    </View>
  </View>
);

// Buttons Section
const ButtonsSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Buton Tasarımları</Text>
    
    {/* Primary Button */}
    <TouchableOpacity 
      style={styles.primaryButton}
      onPress={() => handleButtonPress('Primary Button')}
    >
      <Text style={styles.primaryButtonText}>Primary Button</Text>
    </TouchableOpacity>

    {/* Secondary Button */}
    <TouchableOpacity 
      style={styles.secondaryButton}
      onPress={() => handleButtonPress('Secondary Button')}
    >
      <Text style={styles.secondaryButtonText}>Secondary Button</Text>
    </TouchableOpacity>

    {/* Outline Button */}
    <TouchableOpacity 
      style={styles.outlineButton}
      onPress={() => handleButtonPress('Outline Button')}
    >
      <Text style={styles.outlineButtonText}>Outline Button</Text>
    </TouchableOpacity>

    {/* Icon Button */}
    <TouchableOpacity 
      style={styles.iconButton}
      onPress={() => handleButtonPress('Icon Button')}
    >
      <Text style={styles.iconButtonText}>+</Text>
    </TouchableOpacity>

    {/* Button Group */}
    <View style={styles.buttonGroup}>
      <TouchableOpacity style={styles.groupButton}>
        <Text style={styles.groupButtonText}>Sol</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.groupButton}>
        <Text style={styles.groupButtonText}>Orta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.groupButton}>
        <Text style={styles.groupButtonText}>Sağ</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Forms Section
const FormsSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Form Tasarımları</Text>
    
    {/* Text Input */}
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Ad Soyad</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Adınızı ve soyadınızı girin"
        placeholderTextColor="#999"
      />
    </View>

    {/* Email Input */}
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>E-posta</Text>
      <TextInput
        style={styles.textInput}
        placeholder="ornek@email.com"
        keyboardType="email-address"
        placeholderTextColor="#999"
      />
    </View>

    {/* Password Input */}
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Şifre</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Şifrenizi girin"
        secureTextEntry
        placeholderTextColor="#999"
      />
    </View>

    {/* Switch */}
    <View style={styles.switchContainer}>
      <Text style={styles.switchLabel}>Bildirimleri aç</Text>
      <View style={styles.switch}>
        <View style={styles.switchThumb} />
      </View>
    </View>

    {/* Checkbox */}
    <View style={styles.checkboxContainer}>
      <View style={styles.checkbox}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
      <Text style={styles.checkboxLabel}>Şartları kabul ediyorum</Text>
    </View>
  </View>
);

// Lists Section
const ListsSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Liste Tasarımları</Text>
    
    {/* Simple List */}
    <View style={styles.listContainer}>
      {['Öğe 1', 'Öğe 2', 'Öğe 3', 'Öğe 4'].map((item, index) => (
        <TouchableOpacity key={index} style={styles.listItem}>
          <Text style={styles.listItemText}>{item}</Text>
          <Text style={styles.listItemArrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Detailed List */}
    <View style={styles.detailedList}>
      {[
        { title: 'Proje A', subtitle: 'Aktif', status: 'success' },
        { title: 'Proje B', subtitle: 'Beklemede', status: 'warning' },
        { title: 'Proje C', subtitle: 'Tamamlandı', status: 'info' },
      ].map((item, index) => (
        <View key={index} style={styles.detailedListItem}>
          <View style={styles.detailedItemContent}>
            <Text style={styles.detailedItemTitle}>{item.title}</Text>
            <Text style={styles.detailedItemSubtitle}>{item.subtitle}</Text>
          </View>
          <View style={[styles.statusBadge, styles[`status${item.status}`]]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

// Modals Section
const ModalsSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Modal Tasarımları</Text>
    
    {/* Alert Card */}
    <View style={styles.alertCard}>
      <View style={styles.alertIcon}>
        <Text style={styles.alertIconText}>!</Text>
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>Uyarı</Text>
        <Text style={styles.alertMessage}>
          Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
        </Text>
      </View>
      <View style={styles.alertActions}>
        <TouchableOpacity style={styles.alertButton}>
          <Text style={styles.alertButtonText}>İptal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.alertButton, styles.alertButtonPrimary]}>
          <Text style={styles.alertButtonTextPrimary}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Success Card */}
    <View style={styles.successCard}>
      <View style={styles.successIcon}>
        <Text style={styles.successIconText}>✓</Text>
      </View>
      <Text style={styles.successTitle}>Başarılı!</Text>
      <Text style={styles.successMessage}>
        İşleminiz başarıyla tamamlandı.
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  tabContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  
  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cardButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cardButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cardButtonTextSecondary: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Stats Card
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  
  // Button Styles
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  outlineButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  groupButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  groupButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Form Styles
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  switch: {
    width: 44,
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 2,
  },
  switchThumb: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  
  // List Styles
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  listItemArrow: {
    fontSize: 18,
    color: '#999',
  },
  detailedList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailedListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailedItemContent: {
    flex: 1,
  },
  detailedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailedItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statussuccess: {
    backgroundColor: '#E8F5E8',
  },
  statuswarning: {
    backgroundColor: '#FFF3E0',
  },
  statusinfo: {
    backgroundColor: '#E3F2FD',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Modal Styles
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  alertIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 12,
  },
  alertButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  alertButtonPrimary: {
    backgroundColor: '#FF3B30',
  },
  alertButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  alertButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIconText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default DesignExamples;