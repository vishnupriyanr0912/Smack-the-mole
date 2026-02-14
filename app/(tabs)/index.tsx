import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";

const holes = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 3x3 grid

export default function SmackTheMole() {
  const [score, setScore] = useState(0);
  const [activeMole, setActiveMole] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const animations = useRef(holes.map(() => new Animated.Value(0))).current;

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Random mole pop-up logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      const randomHole = Math.floor(Math.random() * holes.length);
      setActiveMole(randomHole);
      animateMole(randomHole);
    }, 800);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const animateMole = (index) => {
    Animated.sequence([
      Animated.timing(animations[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(animations[index], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (activeMole === index) setActiveMole(null);
    });
  };

  const hitMole = (index) => {
    if (index === activeMole) {
      setScore(score + 1);
      setActiveMole(null);
      animations[index].setValue(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🐹 Smack the Mole!</Text>
      <Text style={styles.stats}>Score: {score} | Time: {timeLeft}s</Text>

      <View style={styles.grid}>
        {holes.map((hole, index) => {
          const moleScale = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          const bgColor = activeMole === index ? "#facc15" : "#60a5fa";

          return (
            <TouchableOpacity
              key={index}
              style={[styles.hole, { backgroundColor: bgColor }]}
              onPress={() => hitMole(index)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.mole,
                  { transform: [{ scale: moleScale }] },
                ]}
              >
                <Text style={styles.moleEmoji}>🐹</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>

      {timeLeft <= 0 && (
        <View style={styles.overlay}>
          <Text style={styles.overText}>Game Over!</Text>
          <Text style={styles.finalScore}>Your Score: {score}</Text>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => {
              setScore(0);
              setTimeLeft(30);
            }}
          >
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e3a8a",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "bold",
  },
  stats: {
    fontSize: 18,
    color: "#fcd34d",
    marginBottom: 20,
  },
  grid: {
    width: 300,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  hole: {
    width: 90,
    height: 90,
    margin: 5,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  mole: {
    position: "absolute",
    bottom: 10,
  },
  moleEmoji: {
    fontSize: 35,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  overText: {
    fontSize: 36,
    color: "#f87171",
    marginBottom: 10,
    fontWeight: "bold",
  },
  finalScore: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  restartText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});