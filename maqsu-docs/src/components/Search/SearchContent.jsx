import React, { useState } from 'react';

const SearchContent = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <div style={{ display: 'flex', margin: '10px auto', width: '100%', backgroundColor: '#23415e', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', margin: '15px auto', width: '68%',borderRadius:'5px', alignItems: 'center', gap: '8px' }}>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search questions, keywords or topics"
                    style={{ padding: '15px', width: '550px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button onClick={handleSearch} style={{ padding: '15px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#394d6e', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'inline-block' }}>🔍</span>
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchContent;