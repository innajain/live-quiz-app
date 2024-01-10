import { DraftQuiz, Participant, Quiz } from "./Quiz";
import { QuizManager } from "./QuizManager";
export const temp = new DraftQuiz("my_quiz");
temp.problems = [
  {
    question: "What is 2+2?",
    options: ["1", "2", "3", "4"],
    answer: 3,
  },
  {
    question: "What is 2+3?",
    options: ["1", "2", "3", "5"],
    answer: 3,
  },
  {
    question: "What is 2+4?",
    options: ["1", "2", "3", "6"],
    answer: 3,
  },
];

export class User {
  name: string;
  emailId: string;
  draftQuizzes: DraftQuiz[];
  liveQuizzes: Quiz[];
  constructor(name: string, emailId: string) {
    this.name = name;
    this.emailId = emailId;
    this.draftQuizzes = [temp];
    this.liveQuizzes = [];
  }
}

export class UsersManager {
  private static instance: UsersManager;
  private static users: User[];
  private constructor() {
    UsersManager.users = [new User("inna", "abc")];
  }
  public static getInstance(): UsersManager {
    if (!UsersManager.instance) {
      UsersManager.instance = new UsersManager();
    }
    return UsersManager.instance;
  }
  public static addUser({ emailId, name }: { emailId: string; name: string }) {
    this.users.push(new User(name, emailId));
  }
  public static getUserData({ emailId }: { emailId: string }): {
    success: boolean;
    data?: {
      name: string;
      emailId: string;
      draftQuizzes: DraftQuiz[];
    };
  } {
    const user = this.users.find((user) => user.emailId === emailId);
    if (user) {
      return {
        success: true,
        data: {
          name: user.name,
          emailId: user.emailId,
          draftQuizzes: user.draftQuizzes,
        },
      };
    }
    return { success: false };
  }

  public static createQuiz(emailId: string) {
    const user = this.users.find((user) => user.emailId === emailId);
    let draftQuizId = this.generateDraftQuizId();
    while (user!.draftQuizzes.find((quiz) => quiz.quizId === draftQuizId)) {
      draftQuizId = this.generateDraftQuizId();
    }
    user!.draftQuizzes.push(new DraftQuiz(draftQuizId));
    return { draftQuizId };
  }

  private static generateDraftQuizId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  public static debug() {
    setInterval(() => {
      console.log("users: ", this.users[0]);
    }, 5000);
  }
  public static floatQuiz({
    draftQuizId,
    emailId,
  }: {
    draftQuizId: string;
    emailId: string;
  }): {
    success: boolean;
    message?: "Quiz floated" | "Quiz not found" | "Quiz already floated";
    quizId?: string;
  } {
    const user = this.users.find((user) => user.emailId === emailId);
    const draftQuiz = user!.draftQuizzes.find(
      (quiz) => quiz.quizId === draftQuizId
    );
    if (!draftQuiz) {
      return { success: false, message: "Quiz not found" };
    }

    user!.draftQuizzes = user!.draftQuizzes.filter(
      (quiz) => quiz.quizId !== draftQuizId
    );
    const quiz = QuizManager.floatQuiz({
      emailId,
      draftQuiz: draftQuiz,
    });

    user?.liveQuizzes.push(quiz);

    return { success: true, message: "Quiz floated", quizId: quiz.quizId };
  }

  public static deleteQuiz({
    emailId,
    quizId,
  }: {
    emailId: string;
    quizId: string;
  }) {
    const user = this.users.find((user) => user.emailId === emailId);
    user!.liveQuizzes = user!.liveQuizzes.filter(
      (quiz) => quiz.quizId !== quizId
    );
  }
}
