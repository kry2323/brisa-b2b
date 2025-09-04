import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Linking,
  Alert,
  Dimensions
} from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { useReportNavigation } from '../utils/navigationUtils';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  photoUrl: string;
}

const LassaTeamScreen = ({ route, navigation }: any) => {
  const { reportData } = route.params || {};
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Use centralized report navigation
  const handleNavigateToReport = useReportNavigation(navigation);
// Team members data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Kemal Yılmaz',
      title: 'Director, International Markets',
      phone: '+90 (216) 544 35 58',
      email: 'k.yilmaz@brisa.com.tr',
      photoUrl: 'https://mediasvcxkc89k4bkkj8j.blob.core.windows.net/sys-master-hybris-image-prod/Dosyalar%2Fcontactmember%2Fkemal-yilmaz.jpg'
    },
    {
      id: '2',
      name: 'Gözde Günsel',
      title: 'Manager, International Marketing',
      phone: '+90 (216) 544 35 90',
      email: 'g.gunsel@brisa.com.tr',
      photoUrl: 'https://mediasvcxkc89k4bkkj8j.blob.core.windows.net/sys-master-hybris-image-prod/Dosyalar%2Fcontactmember%2Fgozde-gunsel.jpg'
    },
    {
      id: '3',
      name: 'Tuna Öztürk',
      title: 'Manager, International Sales\nRegion 2',
      phone: '+90 (216) 544 35 00 / 2176',
      email: 'tuna.ozturk@brisa.com.tr',
      photoUrl: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/Dosyalar/contactmember/tuna-ozturk.png'
    },
    {
      id: '4',
      name: 'Dilhan Uygun Aksoy',
      title: 'Manager/Export Sales (Region 1)',
      phone: '+90 (216) 544 35 25',
      email: 'd.aksoy@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '5',
      name: 'Veli Burak',
      title: 'Sales Manager\nRegion 2',
      phone: '+90 (216) 544 35 00 / 2129',
      email: 'v.burak@brisa.com.tr',
      photoUrl: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/Dosyalar/contactmember/veli-burak.jpg'
    },
    {
      id: '6',
      name: 'Rical Odabaş',
      title: 'Sales Manager\nRegion 2',
      phone: '+90 (216) 544 35 00',
      email: 'r.odabas@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '7',
      name: 'Arman Yılmaz',
      title: 'Sales Manager/Export Sales (Region 2)',
      phone: '+90 (262) 316 43 45',
      email: 'arman.yilmaz@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '8',
      name: 'Mert Küçükçalı',
      title: 'Sales Manager/Export Sales (Region 2)',
      phone: '+90 (216) 547 34 52',
      email: 'm.kucukcali@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '9',
      name: 'Senem Mazmancı',
      title: 'Sales Manager/Export Sales (Region 1)',
      phone: '+90 (216) 544 35 00',
      email: 's.mazmanci@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '10',
      name: 'Umut Kapu',
      title: 'Sales Manager/Export Sales (Region 1)',
      phone: '+90 (216) 544 35 00',
      email: 'u.kapu@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '11',
      name: 'Beyza Uçkaleler',
      title: 'Sales Manager/Export Sales (Region 1)',
      phone: '+90 (216) 544 35 00',
      email: 'b.uckaleler@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '12',
      name: 'Engin Şehsuvar',
      title: 'Specialist, Export Planning',
      phone: '+90 (262) 316 42 52',
      email: 'e.sehsuvar@brisa.com.tr',
      photoUrl: 'https://mediasvcxkc89k4bkkj8j.blob.core.windows.net/sys-master-hybris-image-prod/Dosyalar%2Fcontactmember%2Fengin-sehsuvar.jpg'
    },
    {
      id: '13',
      name: 'Elif Savk',
      title: 'Specialist/Export Planning',
      phone: '+90 (216) 544 35 00',
      email: 'e.savk@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '14',
      name: 'Gülfem Yazıcı',
      title: 'Specialist, Export Planning',
      phone: '+90 (216) 544 35 47',
      email: 'g.yazici@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '15',
      name: 'Aysun Avcı',
      title: 'Specialist, Export Planning',
      phone: '+90 (216) 544 35 00 / 2176',
      email: 'a.avci@brisa.com.tr',
      photoUrl: 'http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/Dosyalar/contactmember/aysun-avci.JPG'
    },
    {
      id: '16',
      name: 'Burak Baç',
      title: 'Brand Manager/International',
      phone: '+90 (216) 544 35 00',
      email: 'b.bac@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '17',
      name: 'Deniz Özbayrak',
      title: 'Brand Manager/International',
      phone: '+90 (216) 544 35 00',
      email: 'd.ozbayrak@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '18',
      name: 'Selis Ozan',
      title: 'Brand Manager/International',
      phone: '+90 (216) 544 35 44',
      email: 's.ozan@brisa.com.tr',
      photoUrl: ''
    },
    {
      id: '19',
      name: 'Aylin Özkanber',
      title: 'Brand Manager/International',
      phone: '+90 (216) 544 35 00',
      email: 'a.ozkanber@brisa.com.tr',
      photoUrl: ''
    }
  ];

  const handlePhoneCall = (phoneNumber: string) => {
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    Linking.openURL(`tel:${cleanPhoneNumber}`).catch(() => {
      Alert.alert('Error', 'Could not open phone app');
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Could not open email app');
    });
  };

  const renderTeamMemberCard = (member: TeamMember) => (
    <View key={member.id} style={styles.card}>
      <View style={styles.cardTop} />
      <View style={styles.cardBottom}>
        <View style={styles.profileContainer}>
          {member.photoUrl ? (
            <Image 
              source={{ uri: member.photoUrl }} 
              style={styles.profileImage}
              defaultSource={require('../../assets/logo.png')}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profilePlaceholderText}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.informationContainer}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberTitle}>{member.title}</Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => handlePhoneCall(member.phone)}
          >
            <Text style={styles.contactText}>{member.phone}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => handleEmail(member.email)}
          >
            <Text style={styles.contactText}>{member.email}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Your Lassa Team</Text>
          
          <View style={styles.teamGrid}>
            {teamMembers.map(renderTeamMemberCard)}
          </View>
        </View>
        <Footer />
      </ScrollView>
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen} 
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={(reportData) => handleNavigateToReport(reportData, setIsReportsModalOpen)}
      />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columns with padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    width: '100%',
    minHeight: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTop: {
    height: 4,
    backgroundColor: '#666',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardBottom: {
    padding: 16,
    alignItems: 'center',
  },
  profileContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
  },
  profilePlaceholderText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  informationContainer: {
    alignItems: 'center',
    width: '100%',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  memberTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
  },
  contactButton: {
    marginVertical: 2,
  },
  contactText: {
    fontSize: 12,
    color: '#0066CC',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default LassaTeamScreen;
