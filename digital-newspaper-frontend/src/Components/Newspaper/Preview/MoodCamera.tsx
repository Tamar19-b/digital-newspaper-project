import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface MoodCameraProps {
  maxFrames?: number; 
  onShareComment?: (text: string) => void; 
}

interface EmojiInfo {
  emoji: string;
  points: number;
}

const emojiMap: Record<string, EmojiInfo> = {
  happy: { emoji: "😄", points: 10 },
  sad: { emoji: "😢", points: 30 },
  angry: { emoji: "😠", points: 20 },
  surprise: { emoji: "😲", points: 30 },
  fear: { emoji: "😨", points: 30 },
  disgust: { emoji: "🤢", points: 30 },
  neutral: { emoji: "😐", points: 5 },
};

const emojiToKey: Record<string, string> = Object.fromEntries(
  Object.entries(emojiMap).map(([key, { emoji }]) => [emoji, key])
);

const MoodCamera: React.FC<MoodCameraProps> = ({ maxFrames = 10, onShareComment }) => {
  const [loading, setLoading] = useState(false);
  const [detectedEmoji, setDetectedEmoji] = useState('');
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.keys(emojiMap).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );
  const [showEmojis, setShowEmojis] = useState(false); 
  const [showShare, setShowShare] = useState(false); 

  // אנימציית ניקוד
  const animateScore = (key: string, finalScore: number) => {
    const step = () => {
      setScores(prev => {
        const current = prev[key];
        if (current < finalScore) {
          const increment = Math.min(finalScore - current, Math.floor(Math.random() * 3) + 1);
          return { ...prev, [key]: current + increment };
        } else {
          return prev;
        }
      });
    };
    const interval = setInterval(() => {
      setScores(prev => {
        if (prev[key] >= finalScore) {
          clearInterval(interval);
        }
        return prev;
      });
      step();
    }, 100);
  };

  const captureAndSendImage = async () => {
    setLoading(true);
    setShowEmojis(true);
    const counts: Record<string, number> = { ...scores };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      for (let i = 0; i < maxFrames; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(video, 0, 0, 320, 240);
        const dataUrl = canvas.toDataURL('image/jpeg');

        const res = await fetch('/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl }),
        });
        const data = await res.json();
        const emoji = data.emoji || "";

        const emojiKey = emojiToKey[emoji] || "neutral";
        counts[emojiKey] = (counts[emojiKey] || 0) + emojiMap[emojiKey].points;

        animateScore(emojiKey, counts[emojiKey]);
      }

      // האימוגי עם הניקוד הגבוהה
      let maxScore = -1;
      let finalEmoji = "";
      for (const key in counts) {
        if (counts[key] > maxScore) {
          maxScore = counts[key];
          finalEmoji = emojiMap[key].emoji;
        }
      }

      setDetectedEmoji(finalEmoji);
      setShowShare(true); // להראות את שורת השיתוף
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("שגיאה בצילום או בשליחה:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareClick = () => {
    if (onShareComment) {
      onShareComment(`היי התגובה שלי היא ${detectedEmoji}`);
      setShowShare(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '0.5rem',
      background: '#F1F5F9',
      borderRadius: '16px',
      padding: '1rem 0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center' }}>
        <button
          onClick={captureAndSendImage}
          disabled={loading}
          style={{
            background: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
          }}
          title={loading ? " מצלמים..." : "פתח מצלמה"}
        >
          <i className={`bi ${loading ? 'bi-hourglass-split' : 'bi-camera'}`}></i>
        </button>

        <span style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          תגובתך לכתבה זו: <span style={{ fontSize: '1.5rem' }}>{detectedEmoji}</span>
        </span>
      </div>

      {showEmojis && (
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '0.3rem',
          opacity: showEmojis ? 1 : 0,
          transform: showEmojis ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.3s ease-in-out'
        }}>
          {Object.entries(emojiMap).map(([key, info]) => (
            <div key={key} style={{ fontSize: '1.2rem', textAlign: 'center' }}>
              <div>{info.emoji}</div>
              <div style={{ fontSize: '0.75rem', color: '#555' }}>{scores[key] || 0}</div>
            </div>
          ))}
        </div>
      )}

      {/* שורת שיתוף */}
      {showShare && (
        <div
          onClick={handleShareClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
            cursor: 'pointer',
            color: '#1a73e8',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          <i className="bi bi-arrow-right-circle" style={{ fontSize: '1.5rem' }}></i>
          <span>שתף את חוות דעתך על כתבה זו עם כולם...</span>
        </div>
      )}
    </div>
  );
};

export default MoodCamera;
