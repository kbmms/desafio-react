import {MagnifyingGlass} from "@phosphor-icons/react";
import Movies from "../components/Movies";
import {useState} from 'react'

export default function Home(){
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearchQueryChange = (query: string) => {
        setIsLoading(true);
        setSearchQuery(query);
        localStorage.setItem('film', query)
    };

    return(
        <div className="bg-bgPrimay-900">
            <div className="max-w-[912px] mx-auto h-screen">
                <main className="pt-12 flex flex-col h-screen">
                        <div className="bg-white flex items-center gap-2 p-2 rounded-md m-4 lg:m-0">
                            <MagnifyingGlass size={24} color="#B0B0B0" />
                            <input 
                            className="w-full h-8 outline-none" 
                            type="text" 
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => handleSearchQueryChange(e.target.value)}/>
                            
                        </div>
                        <Movies searchQuery={searchQuery}  setIsLoading={setIsLoading} />
                </main>
            </div>
        </div>
    )
}