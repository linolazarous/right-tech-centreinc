import React, { useEffect, useState } from 'react';
import { getStudyGroups } from '../services/socialService';

const StudyGroupList = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const data = await getStudyGroups();
        setGroups(data);
    };

    return (
        <div>
            <h1>Study Groups</h1>
            {groups.map((group) => (
                <div key={group._id}>
                    <h2>{group.name}</h2>
                    <p>Members: {group.members.map((member) => member.name).join(', ')}</p>
                </div>
            ))}
        </div>
    );
};

export default StudyGroupList;