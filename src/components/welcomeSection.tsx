"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSoundEffects } from "@/app/hooks/useSoundEffect";


interface WelcomeSectionProps {
    username?: string;
}

export default function WelcomeSection({ username }: WelcomeSectionProps) {
    const router = useRouter();
    const { playSound } = useSoundEffects();

    const [text, setText] = useState("");
    const fullText = `Welcome ${username || "Quiz Master"}! Ready to test your knowledge?`;

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) {
                clearInterval(interval)
            }
        }, 50)

        return (() => clearInterval(interval));
    }, [fullText]);


    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center p-8"
        >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">{text}</h1>
            <motion.p initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-gray-300 mt-4 text-lg">
                Select your mode and start the challenge! 🎯

            </motion.p>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg"
                onClick={() => {
                    playSound("click");
                    setTimeout(() => router.push("/quiz"), 300); // Delay ensures sound plays
                }}
            >
                🚀 Start Quiz
            </motion.button>

        </motion.div>


    )
}