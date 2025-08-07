import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';

interface VideoPlayerScreenProps {
  route: {
    params: {
      videoUrl: string;
      title?: string;
    };
  };
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { videoUrl, title } = route.params;

  const handleClose = () => {
    navigation.goBack();
  };

  // Convert Vimeo download URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (url.includes('vimeo.com/download')) {
      // Extract video ID from download URL
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

  const handleWebViewLoad = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView loaded: ', nativeEvent);
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        <WebView
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
          }}
          injectedJavaScript={`
            // Enable video autoplay
            document.addEventListener('DOMContentLoaded', function() {
              var videos = document.querySelectorAll('video');
              videos.forEach(function(video) {
                video.play();
              });
            });
            true;
          `}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'MuseoSans-Medium',
    marginRight: 40, // Compensate for close button width
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPlayer: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default VideoPlayerScreen;
