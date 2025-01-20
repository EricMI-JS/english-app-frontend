import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import QuizPage from "./pages/home/QuizPage";
import AppLayout from "./layouts/AppLayout";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/quiz" element={<QuizPage />} />
                </Route>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    )
}
