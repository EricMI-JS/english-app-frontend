import { useState } from "react";
import { Button, Modal, Typography } from '@mui/material';
import { Toaster } from "sonner";
import { Link, Outlet } from "react-router-dom";
import WordList from "../../components/words/WordList";
import WordForm from "../../components/words/WordForm";

export default function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    return (
        <>
            <div className="bg-gray-100 min-h-screen py-10">
                <main className="mx-auto max-w-5xl p-4">
                    <div className="flex justify-end gap-3">
                        <Button onClick={handleOpen} variant="contained" color="primary">
                            Añadir palabra
                        </Button>
                        <Link to="/quiz">
                            <Button variant="contained" color="primary">Realizar quiz</Button>
                        </Link>
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
                            Añadir nueva palabra
                        </Typography>
                    </div>
                    <WordForm handleClose={handleClose} />
                </div>
            </Modal >

            <Toaster />
        </>
    )
}
