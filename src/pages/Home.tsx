import { useEffect, useState } from "react";
import { database } from "../firebase-config";
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    [key: string]: any;
}

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ firstName: "", lastName: "" });
    const [editUser, setEditUser] = useState<User | null>(null);
    const userId = "pB3Vm323LL9RkNrFBEXk"; // Specific user ID

    useEffect(() => {

        // get a specific user by id
        const getUser = async () => {
            const userDocRef = doc(database, "users", userId);
            const data = await getDoc(userDocRef);
            if (data.exists()) {
                const userData = { ...data.data(), id: data.id } as User;
                console.log("Specific User:", userData);
                setUser(userData);
            } else {
                console.log("No such document!");
            }
        };

        // get all users
        const getUsers = async () => {
            const usersCollectionRef = collection(database, "users");
            const data = await getDocs(usersCollectionRef);
            const usersList = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
            console.log("All Users:", usersList);
            setUsers(usersList);
        };

        getUser();
        getUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Create a new user
            const usersCollectionRef = collection(database, "users");
            await addDoc(usersCollectionRef, newUser);
            setNewUser({ firstName: "", lastName: "" }); // Reset form
            // Refresh user list
            const data = await getDocs(usersCollectionRef);
            const usersList = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
            setUsers(usersList);
        } catch (error) {
            console.error("Error adding user: ", error);
        }
    };

    const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (editUser) {
            setEditUser(prevState => ({
                ...prevState!,
                [name]: value
            }));
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editUser) {
            try {
                // Update a user by id
                const userDocRef = doc(database, "users", editUser.id);
                await updateDoc(userDocRef, {
                    firstName: editUser.firstName,
                    lastName: editUser.lastName
                });
                // Refresh user list
                const usersCollectionRef = collection(database, "users");
                const data = await getDocs(usersCollectionRef);
                const usersList = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
                setUsers(usersList);
                setEditUser(null); // Clear edit form
            } catch (error) {
                console.error("Error updating user: ", error);
            }
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            // Delete a user by id
            const userDocRef = doc(database, "users", userId);
            await deleteDoc(userDocRef);
            // Refresh user list
            const usersCollectionRef = collection(database, "users");
            const data = await getDocs(usersCollectionRef);
            const usersList = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
            setUsers(usersList);
        } catch (error) {
            console.error("Error deleting user: ", error);
        }
    };

    return (
        <div>
            <h1>Welcome to Trollbeads Training!</h1>
            <p>Here you can learn about the history and culture of Trollbeads, as well as how to create your own unique pieces of jewelry.</p>
            
            {user && (
                <div>
                    <h2>Specific User Information</h2>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                </div>
            )}

            <div>
                <h2>All Users</h2>
                {users.length > 0 ? (
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                <p><strong>First Name:</strong> {user.firstName}</p>
                                <p><strong>Last Name:</strong> {user.lastName}</p>
                                <button onClick={() => setEditUser(user)}>Edit</button>
                                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users found.</p>
                )}
            </div>

            <div>
                <h2>Add a New User</h2>
                <form onSubmit={handleAddUser}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={newUser.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={newUser.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit">Add User</button>
                </form>
            </div>

            {editUser && (
                <div>
                    <h2>Edit User</h2>
                    <form onSubmit={handleUpdateUser}>
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={editUser.firstName}
                                onChange={handleEditUserChange}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={editUser.lastName}
                                onChange={handleEditUserChange}
                                required
                            />
                        </label>
                        <br />
                        <button type="submit">Update User</button>
                        <button type="button" onClick={() => setEditUser(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
}
