import { Outlet } from "react-router-dom";

export default function EnglishApp() {
    return (
        <>
            <header className="h-[10vh] p-6 text-3xl bg-white">Eric Morales</header>

            <main>
                <div className="flex flex-col md:flex-row">
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    )
}
