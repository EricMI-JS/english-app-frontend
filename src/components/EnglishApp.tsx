import { Outlet } from "react-router-dom";

export default function EnglishApp() {
    return (
        <>
            <header>header</header>

            <main>
                <div className="flex flex-col md:flex-row gap-10 mt-10">
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    )
}
