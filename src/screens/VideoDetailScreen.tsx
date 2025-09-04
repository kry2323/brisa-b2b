import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { getVideoLibraryData, VideoItem } from '../utils/mockData';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { useReportNavigation } from '../utils/navigationUtils';

interface VideoDetailScreenProps {
  route: {
    params: {
      videoId: string;
      videoUrl?: string;
      title?: string;
    };
  };
}

const VideoDetailScreen: React.FC<VideoDetailScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { videoId, videoUrl, title } = route.params;
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoItem[]>([]);
  const [webViewKey, setWebViewKey] = useState(0);
  // WebView referansını useRef ile tutarak gereksiz yeniden render'ları önleyelim
  const webViewRef = React.useRef<WebView>(null);
  // isPlaying durumunu useRef ile tutarak sonsuz döngüleri önleyelim
  const isPlayingRef = React.useRef(false);
  // isPlaying state'i sadece UI güncellemeleri için kullanılacak
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Use centralized report navigation
  const handleNavigateToReport = useReportNavigation(navigation);
// Bileşen ilk yüklendiğinde veya videoId değiştiğinde çalışacak
  useEffect(() => {
    // Video verilerini bir kez yükle
    const loadVideoData = () => {
      const allVideos = getVideoLibraryData();
      const video = allVideos.find(v => v.id === videoId);
      setCurrentVideo(video || null);
      
      // Video başlığını sayfa başlığı olarak ayarla
      if (video) {
        navigation.setOptions({
          title: video.title || title || 'Video Detay'
        });
      }
      
      // İlgili videoları yükle
      if (video) {
        const related = allVideos.filter(v => v.id !== videoId).slice(0, 3);
        setRelatedVideos(related);
      }
      
      // Video yüklendiğinde oynatma durumunu sıfırla
      // Önce ref'i güncelle, sonra state'i güncelle
      isPlayingRef.current = false;
      setIsPlaying(false);
    };
    
    loadVideoData();
    
    // Temizleme fonksiyonu
    return () => {
      // Bileşen kaldırıldığında yapılacak temizlik işlemleri
      // Bileşen unmount edildiğinde ref'i sıfırla
      isPlayingRef.current = false;
    };
  }, [videoId]); // Sadece videoId değiştiğinde çalışsın

  const handleVideoPress = (video: VideoItem) => {
    // @ts-ignore
    navigation.navigate('VideoDetail', {
      videoId: video.id,
      videoUrl: video.videoUrl,
      title: video.title,
    });
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('vimeo.com/download')) {
      const match = url.match(/download\/(\d+)/);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1&title=0&byline=0&portrait=0&controls=1&muted=0`;
      }
    }
    
    if (url.includes('player.vimeo.com/external')) {
      const match = url.match(/external\/(\d+)/);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1&title=0&byline=0&portrait=0&controls=1&muted=0`;
      }
    }
    
    if (url.includes('player.vimeo.com/play')) {
      const match = url.match(/play\/(\d+)/);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1&title=0&byline=0&portrait=0&controls=1&muted=0`;
      }
    }
    
    if (url.includes('player.vimeo.com/video/')) {
      return `${url}${url.includes('?') ? '&' : '?'}autoplay=1&title=0&byline=0&portrait=0&controls=1&muted=0`;
    }
    
    return url;
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
  };

  // WebView yüklendiğinde çağrılan fonksiyon
  const handleWebViewLoad = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView loaded: ', nativeEvent);
    // Video yüklendiğinde isPlaying durumunu güncelleme
    // Bu satırı kaldırarak gereksiz durum güncellemesini önlüyoruz
    // setIsPlaying(false);
  };

  const handlePlayButtonPress = () => {
    try {
      if (webViewRef.current) {
        // Önce ref'i güncelle, sonra state'i güncelle
        isPlayingRef.current = true;
        setIsPlaying(true);
        
        // JavaScript to play the video
        webViewRef.current.injectJavaScript(`
          try {
            var videos = document.querySelectorAll('video');
            if (videos && videos.length > 0) {
              videos.forEach(function(video) {
                if (video && typeof video.play === 'function') {
                  video.play()
                    .catch(function(error) {
                      console.error('Video play failed:', error);
                      // Video oynatma başarısız olursa React Native'e bildir
                      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'videoStatus', isPlaying: false, error: 'play_failed'}));
                    });
                } else {
                  console.warn('Video element or play function not found');
                }
              });
            } else {
              console.warn('No video elements found in the document');
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'videoStatus', isPlaying: false, error: 'no_video_found'}));
            }
            true;
          } catch (e) {
            console.error('Error playing video:', e);
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'videoStatus', isPlaying: false, error: 'js_error'}));
            true;
          }
        `);
      } else {
        console.warn('WebView reference is not available');
      }
    } catch (error) {
      console.warn('Error in handlePlayButtonPress:', error);
      // Hata durumunda önce ref'i güncelle, sonra state'i güncelle
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  };

  const handlePauseButtonPress = () => {
    try {
      if (webViewRef.current) {
        // Önce ref'i güncelle, sonra state'i güncelle
        isPlayingRef.current = false;
        setIsPlaying(false);
        
        // JavaScript to pause the video
        webViewRef.current.injectJavaScript(`
          try {
            var videos = document.querySelectorAll('video');
            if (videos && videos.length > 0) {
              videos.forEach(function(video) {
                if (video && typeof video.pause === 'function') {
                  video.pause();
                } else {
                  console.warn('Video element or pause function not found');
                }
              });
            } else {
              console.warn('No video elements found in the document');
            }
            true;
          } catch (e) {
            console.error('Error pausing video:', e);
            true;
          }
        `);
      } else {
        console.warn('WebView reference is not available');
      }
    } catch (error) {
      console.warn('Error in handlePauseButtonPress:', error);
      // Hata durumunda ref'i güncellemeye gerek yok, zaten false olarak ayarlandı
    }
  };

  if (!currentVideo) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
        <BottomNavigation 
          isReportsModalOpen={isReportsModalOpen} 
          setIsReportsModalOpen={setIsReportsModalOpen}
          onNavigateToReport={(reportData) => handleNavigateToReport(reportData, setIsReportsModalOpen)}
        />
      </SafeAreaView>
    );
  }

  const embedUrl = getEmbedUrl(currentVideo.videoUrl);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Main Video Section */}
          <View style={styles.mainVideoSection}>
            {/* Video Player */}
            <View style={styles.videoContainer}>
              <WebView
                key={webViewKey}
                ref={webViewRef}
                source={{ 
                  uri: embedUrl,
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                  }
                }}
                style={styles.videoPlayer}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                allowsFullscreenVideo={true}
                onError={handleWebViewError}
                onLoad={handleWebViewLoad}
                onMessage={(event) => {
                  console.log('WebView message:', event.nativeEvent.data);
                  // Video durumunu kontrol etmek için mesajları işleyebiliriz
                  try {
                    const message = JSON.parse(event.nativeEvent.data);
                    if (message && message.type === 'videoStatus') {
                      // Sadece mevcut durumdan farklıysa güncelle
                      if (message.isPlaying !== isPlayingRef.current) {
                        // Önce ref'i güncelle, sonra state'i güncelle
                        isPlayingRef.current = message.isPlaying;
                        // React state'i sadece UI güncellemesi için kullanılıyor
                        setIsPlaying(message.isPlaying);
                      }
                    }
                  } catch (e) {
                    // JSON parse hatası, mesaj JSON formatında değil
                  }
                }}
                injectedJavaScript={`
                  // Video durumu için bir değişken tanımlayalım
                  window._isVideoPlaying = false;
                  
                  // Video durumunu sadece değiştiğinde bildir
                  function updateVideoStatus(isPlaying) {
                    if (window._isVideoPlaying !== isPlaying) {
                      window._isVideoPlaying = isPlaying;
                      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'videoStatus', isPlaying: isPlaying}));
                    }
                  }
                  
                  // Enable video autoplay and track video status
                  document.addEventListener('DOMContentLoaded', function() {
                    var videos = document.querySelectorAll('video');
                    videos.forEach(function(video) {
                      // Otomatik oynatma denemesi
                      video.play().catch(function(e) {
                        console.error('Video autoplay failed:', e);
                        updateVideoStatus(false);
                      });
                      
                      // Video durumunu izleme
                      video.addEventListener('play', function() {
                        updateVideoStatus(true);
                      });
                      
                      video.addEventListener('pause', function() {
                        updateVideoStatus(false);
                      });
                      
                      video.addEventListener('ended', function() {
                        updateVideoStatus(false);
                      });
                    });
                  });
                  true;
                `}
              />
              {/* Center Play Button - Only show when not playing */}
              {!isPlaying && (
                <View style={styles.centerPlayButtonContainer}>
                  <TouchableOpacity 
                    style={styles.centerPlayButton}
                    onPress={handlePlayButtonPress}
                  >
                    <Text style={styles.centerPlayIcon}>▶</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Video Info */}
            <View style={styles.videoInfo}>
              <View style={styles.videoHeader}>
                <Text style={styles.videoTitle}>{currentVideo.title}</Text>
                <TouchableOpacity style={styles.downloadButton}>
                  <Text style={styles.downloadIcon}>⬇</Text>
                  <Text style={styles.downloadText}>Download</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.videoDate}>{currentVideo.date}</Text>
              <Text style={styles.videoDescription}>
                {currentVideo.description || 'Video description will appear here.'}
              </Text>
            </View>
          </View>

          {/* Related Videos Section */}
          <View style={styles.relatedVideosSection}>
            <Text style={styles.relatedVideosTitle}>Related Videos</Text>
            {relatedVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={styles.relatedVideoCard}
                onPress={() => handleVideoPress(video)}
              >
                <View style={styles.relatedVideoThumbnail}>
                  <Image
                    source={require('../../assets/logo.png')}
                    style={styles.relatedVideoImage}
                  />
                  <View style={styles.playOverlay}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                  <View style={styles.videoBadge}>
                    <Text style={styles.videoBadgeText}>🎥</Text>
                  </View>
                </View>
                <View style={styles.relatedVideoInfo}>
                  <Text style={styles.relatedVideoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <Text style={styles.relatedVideoDate}>{video.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <Footer />
      
      <BottomNavigation 
        isReportsModalOpen={isReportsModalOpen} 
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={handleNavigateToReport}
      />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  mainVideoSection: {
    marginBottom: 24,
  },
  videoContainer: {
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    minHeight: 300,
  },
  videoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  videoInfo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
    color: '#383838',
    flex: 1,
    marginRight: 12,
  },
  downloadButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadIcon: {
    color: '#fff',
    fontSize: 14,
    marginRight: 4,
  },
  downloadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
  },
  videoDate: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'MuseoSans-Regular',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'MuseoSans-Regular',
    lineHeight: 20,
  },
  relatedVideosSection: {
    marginTop: 16,
  },
  relatedVideosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'MuseoSans-Bold',
    color: '#383838',
    marginBottom: 16,
  },
  relatedVideoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  relatedVideoThumbnail: {
    position: 'relative',
    width: 120,
    height: 80,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    overflow: 'hidden',
  },
  relatedVideoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centerPlayButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'auto',
  },
  centerPlayButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayIcon: {
    color: '#fff',
    fontSize: 36,
    marginLeft: 5,
  },
  videoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: 10,
  },
  relatedVideoInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  relatedVideoTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'MuseoSans-Medium',
    color: '#383838',
    marginBottom: 4,
  },
  relatedVideoDate: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'MuseoSans-Regular',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});

export default VideoDetailScreen;
