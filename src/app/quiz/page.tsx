"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QuizData } from '../state/types';
import { useSoundEffects } from '../hooks/useSoundEffect';
import { toast } from "react-hot-toast";




type SelectedAnswers = {
  [key: number]: number;
}




export default function Quiz() {
  const [data, setData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSeletedAnswers] = useState<SelectedAnswers>({});
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showingAnswers, setShowingAnswers] = useState<boolean>(false);


  const { playSound } = useSoundEffects();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/Uw5CrX');
        if (response.status === 200) {
          setData(response.data);
        }
        console.log(response.data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "There was an error fetching the quiz data.";
        setError(errorMessage);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleNext = (): void => {
    if (data && currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      playSound("click");
    }
  }
  const handlePrevious = (): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      playSound("click");
    }
  }

  const handleOptionSelect = (questiodId: number, optionId: number): void => {
    setSeletedAnswers(prev => ({
      ...prev, [questiodId]: optionId
    }))
    playSound("correct");

  }

  const calculateScore = (): number => {
    if (!data) return 0;

    let totalScore = 0;

    Object.entries(selectedAnswers).forEach(([questionId, selectedOptionId]) => {
      const question = data.questions.find(q => q.id === parseInt(questionId));
      const selectedOption = question?.options.find(opt => opt.id === selectedOptionId);

      if (selectedOption?.is_correct) {
        totalScore += parseFloat(data.correct_answer_marks);
      } else {
        totalScore -= parseFloat(data.negative_marks);
      }
    });
    console.log(totalScore);

    return totalScore;

  }

  const handleSubmit = (): void => {
    if (!data || !data.questions) return;
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsQuizComplete(true);
    setShowingAnswers(true);
    playSound("complete")
    toast.success(`🎉 Quiz Completed! Your Score: ${finalScore}/${data.questions.length * 4}`, {
      duration: 4000,
      position: "top-center",
    });
  }
  const AnswerReview = () => {
    if (!data) return null;

    return (
      <div className="flex flex-col h-full space-y-4  ">
        <div className="bg-white p-4 border-b">
          <h3 className="text-xl font-bold mb-2">Final Score: {score}/{data.questions.length * 4}</h3>
          <p className="text-sm text-gray-600">Review your answers below:</p>
        </div>

        {data.questions.map((question, index) => {
          const selectedAnswer = question.options.find(opt => opt.id === selectedAnswers[question.id]);
          const correctAnswer = question.options.find(opt => opt.is_correct);
          const isCorrect = selectedAnswer?.is_correct;

          return (
            <Card key={question.id} className="p-4">
              <div className="space-y-2">
                <h4 className="font-bold">Question {index + 1}: {question.description}</h4>

                <div className="pl-4">
                  <p className="text-gray-700">Your answer:
                    <span className={`ml-2 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedAnswer?.description || 'Not answered'}
                    </span>
                  </p>

                  {!isCorrect && (
                    <p className="text-green-600">
                      Correct answer: {correctAnswer?.description}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mt-2">
                    {isCorrect ?
                      `✓ Correct! (+${data.correct_answer_marks} points)` :
                      `✗ Incorrect (-${data.negative_marks} points)`}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}

        <div className="flex justify-center mt-6">
          <Button
            onClick={() => window.location.reload()}
            className="border border-black text-red-600 font-bold bg-white"
          >
            Restart Quiz
          </Button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <div className="h-screen text-center">Loading quiz...</div>;
  }

  const currentQuestion = data.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === data.questions.length - 1;
  const hasSelectedAnswer = selectedAnswers[currentQuestion.id] !== undefined;


  return (
    <div className='min-h-screen flex justify-center items-center p-4'>
      <Card className='w-full sm:w-3/4 md:w-1/2 lg:w-1/2 max-w-2xl p-2'>
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
          <div className='text-gray-400 text-sm'>
            Question {currentQuestionIndex + 1} of {data.questions.length}
          </div>
        </CardHeader>
        <CardContent>

          {!isQuizComplete && (
            <div className="mb-6">
              <p className="text-lg font-bold">Scoring Info:</p>
              <p className="text-md">Correct Answer: +4 points</p>
              <p className="text-md">Wrong Answer: -1 point</p>
              <p className="text-md">Good luck!</p>
            </div>
          )}

          {isQuizComplete ? (
            <AnswerReview />
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-bold">{currentQuestion.description}</p>
              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <input type='radio'
                      id={`option-${option.id}`}
                      name={`question-${currentQuestion.id}`}
                      checked={selectedAnswers[currentQuestion.id] === option.id}
                      onChange={() => handleOptionSelect(currentQuestion.id, option.id)}
                      className='w-4 h-4'
                    />
                    <label className='flex-1 p-2 hover:bg-gray-200 rounded'>{option.description}</label>
                  </div>
                ))}

              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handlePrevious}
                  className='border border-black text-red-600 font-bold bg-white'
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                {isLastQuestion ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswers).length !== data.questions.length}
                    className='border border-black text-red-600 font-bold bg-white'

                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!hasSelectedAnswer}
                    className='border border-black text-red-600 font-bold bg-white'

                  >
                    Next
                  </Button>
                )}
              </div>

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



