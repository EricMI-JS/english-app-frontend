import { useState } from "react";
import { Modal, Typography } from '@mui/material';
import { Toaster } from "sonner";
import { Link, Outlet } from "react-router-dom";
import WordList from "../../components/words/WordList";
import WordForm from "../../components/words/WordForm";

import QuizIcon from '@mui/icons-material/Quiz';
import AddIcon from '@mui/icons-material/Add';

export default function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    return (
        <>
            <div className="min-h-screen">
                <main className="mx-auto max-w-5xl p-4">
                    <div className="flex justify-end gap-3">
                        <Link to="/quiz">
                            <button className="px-5 py-2 bg-pink-100 text-pink-600 rounded-md"><QuizIcon /> Realizar quiz</button>
                        </Link>
                        <button className="px-5 py-2 bg-blue-100 text-blue-800 rounded-md" onClick={handleOpen}>
                            <AddIcon /> New Word
                        </button>
                    </div>
                    <div className="mt-5">
                        <WordList />
                    </div>

                    <Outlet />
                </main>
            </div>


            <Modal
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 lg:w-auto min-w-80 bg-white shadow-lg p-4 rounded-lg overflow-auto">
                    <div className="mb-3 p-2">
                        <Typography id="modal-title" variant="h6" component="h2">
                            Add new word
                        </Typography>
                    </div>
                    <WordForm handleClose={handleClose} />
                </div>
            </Modal >

            <Toaster />
        </>
    )
}
