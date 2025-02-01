export interface Option {
    id: number;
    description: string;
    question_id: number;
    is_correct: boolean;
    created_at: string;
    updated_at: string;
    unanswered: boolean;
    photo_url: string | null;
}

export interface Question {
    id: number;
    description: string;
    topic: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    detailed_solution: string;
    options: Option[];
    reading_material: string | object | null;
}

export interface QuizData {
    id: number;
    title: string;
    description: string;
    difficulty_level: string | null;
    topic: string;
    duration: number;
    negative_marks: string;
    correct_answer_marks: string;
    questions: Question[]
    qustion_count: number;

}
