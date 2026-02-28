"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/app/services/api-client";
import Loading from "@/app/[locale]/loading";
import { cn } from "@/app/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClose } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";

// danh sách các giá trị phân loại hiện có, nếu mở rộng có thể
// bổ sung thêm hoặc chuyển sang `string`.
type Category =
  | "Khái niệm"
  | "Biển báo"
  | "Kỹ thuật lái xe"
  | "Văn hóa giao thông"
  | string; // cho trường hợp khác

type Answer = {
  index: number;
  label: string;
  text: string;
  correct: boolean;
  isCorrectLiteral: string;
}

type AnswerState = "idle" | "correct" | "wrong";

type Question = {
  number: number;
  question: string;
  category: Category;
  /** câu hỏi đánh dấu là “điểm liệt” */
  isDiemLiet: boolean;
  /** các phương án trả lời, có thể rỗng */
  answers: Answer[];
  explanation: string;
  /** đường dẫn tới hình (nếu có), null khi không có */
  image: string | null;
  hinhanhqAlt: string;
  /** chỉ số phương án đúng (1‑based trong dữ liệu hiện tại) */
  correctAnswer: number;
}

/** toàn bộ dữ liệu, khoá là mã câu hỏi */
type QuestionMap = Record<number, Question>;
type QuestionAnsweredMap = Record<number, number>;

const Page = () => {
  const [questions, setQuestions] = useState<QuestionMap | null>(null);
  const [answers, setAnswers] = useState<QuestionAnsweredMap>({});
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [answerId, setAnswerId] = useState<number | null>(null);
  const questionRefs = useRef<HTMLDivElement[]>([]);

  const question = questions && questionId ? questions[questionId] : null;
  const isAnswered = !!(questionId && answers[questionId]);

  const loadData = async () => {
    const data: QuestionMap = await apiClient.get('/600lythuyetoto/data.json');
    setQuestions(data);
    setQuestionId(1);
  }

  const handleSelect = useCallback((qId: number, aId: number) => {
    setAnswerId(aId);
    setAnswers((prev) => ({ ...prev, [qId]: aId }));
  }, []);

  const handleReset = useCallback(() => {
    setAnswerId(null);
    setQuestionId(1);
    setAnswers({});
  }, []);

  const handleShuffle = () => {
    if (questions) {
      const shuffledQuestions: QuestionMap = Object.fromEntries(
        Object.values(questions)
          .sort(() => Math.random() - 0.5)
          .map((question, index) => {
            question.number = index + 1;
            return [question.number, question];
          })
      );

      setQuestionId(1);
      setAnswers({});
      setAnswerId(null);
      setQuestions(shuffledQuestions);
    }
  }

  useEffect(() => {
    const loadDataDefered = setTimeout(loadData, 1000);

    return () => {
      clearTimeout(loadDataDefered);
    }
  }, []);

  useEffect(() => {
    if (questionId && questionRefs.current[questionId - 1]) {
      questionRefs.current[questionId - 1].scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [questionId]);

  if (!questions || !question) {
    return (
      <Loading />
    )
  }

  return (
    <div id="page-600-cau-ly-thuyet-oto"
      className="h-svh w-full max-w-3xl mx-auto flex flex-col p-3">
      {/* Question Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.number}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.1, }}
          className="flex-auto overflow-auto pb-3 relative"
        >
          {/* Header */}
          <div className="mx-auto w-full bg-white z-1 sticky top-0 left-0">
            <div className="py-2 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Câu {question.number}/{Object.keys(questions).length}
              </span>
              {question.isDiemLiet && (
                <b>(Câu điểm liệt)</b>
              )}
            </div>
          </div>
          <div className="mb-8 text-xl font-normal leading-relaxed text-foreground">
            {question.image && (
              <div className="mb-2 border-b-gray-600">
                <img src={question.image} className="w-full block" />
              </div>
            )}
            <span>{question.question}</span>
          </div>
          <div className="space-y-3">
            {question.answers.map((answer) => {
              const isThis = answer.index === answerId;
              const isRight = answer.index === question.correctAnswer;
              let state: AnswerState = "idle";

              if (isAnswered && isRight) state = "correct";
              else if (isAnswered && isThis && !isRight) state = "wrong";

              return (
                <motion.button
                  key={answer.index}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  onClick={() => handleSelect(question.number, answer.index)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-colors",
                    state === "idle" &&
                    "border-border bg-card hover:border-primary/40 hover:bg-primary/5",
                    state === "correct" &&
                    "border-green-600 bg-green-300",
                    state === "wrong" &&
                    "border-red-600 bg-red-300"
                  )}
                >
                  {/* {state !== 'idle' && (
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                        state === "correct" && "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]",
                        state === "wrong" && "bg-destructive text-destructive-foreground"
                      )}
                    >
                      {state === "correct" && (
                        // <CheckCircle2 className="h-5 w-5" />
                        <FontAwesomeIcon icon={faCheckCircle} />
                      )}
                      {state === "wrong" && (
                        <FontAwesomeIcon icon={faClose} />
                      )}
                    </span>
                  )} */}
                  <span className="text-base font-medium text-foreground">{answer.label}. {answer.text}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Question List */}
      <div className="mt-auto flex-initial shrink-0 py-2">
        <div className="flex items-start justify-start gap-2 overflow-auto scroll-smooth">
          {Object.entries(questions).map(([key, q]) => (
            <div key={key}
              className="inline-flex justify-center items-center w-16 h-16 flex-initial shrink-0 rounded-md bg-gray-300"
              onClick={() => setQuestionId(q.number)}
              ref={(e) => { e && questionRefs.current.push(e) }}
            >
              {q.number === question.number && (
                <div className="font-bold text-2xl">{key}</div>
              )}
              {q.number !== question.number && (
                <div>{key}</div>
              )}
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mt-2 flex gap-2">
          <Button type="button" variant="outlined" onClick={() => setQuestionId(question.number - 1)} disabled={question.number === 1}>trước</Button>
          <Button type="button" variant="outlined" onClick={() => setQuestionId(question.number + 1)} disabled={questionId === Object.entries(questions).length}>sau</Button>
          <Button type="button" variant="outlined" onClick={() => handleReset()}>Làm lại</Button>
          <Button type="button" variant="outlined" onClick={() => handleShuffle()}>Ngẫu nhiên</Button>
        </div>
      </div>
    </div>
  )
}

export default Page;
