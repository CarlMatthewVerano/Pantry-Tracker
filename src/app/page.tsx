"use client";

import { useState, useEffect } from "react";
import firestore from "../../firebase";
import {
    Box,
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
} from "firebase/firestore";

interface PantryItem {
    name: string;
    quantity: number;
}

export default function Home() {
    const [pantry, setPantry] = useState<PantryItem[]>([]);
    const [open, setOpen] = useState(true);
    const [itemName, setItemName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPantry, setFilteredPantry] = useState<PantryItem[]>([]);

    const filterPantryItems = () => {
        const filtered = pantry.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredPantry(filtered);
    };

    const updatePantry = async () => {
        const snapshot = query(collection(firestore, "pantry"));
        const docs = await getDocs(snapshot);
        const pantryList: PantryItem[] = [];
        docs.forEach((doc) => {
            const data = doc.data();
            pantryList.push({ name: doc.id, quantity: data.quantity });
        });
        setPantry(pantryList);
    };

    const removeItem = async (item: string) => {
        const docRef = doc(collection(firestore, "pantry"), item);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            if (quantity === 1) {
                await deleteDoc(docRef);
            } else {
                await setDoc(docRef, {
                    quantity: quantity - 1,
                });
            }
        }
        await updatePantry();
    };

    const addItem = async (item: string) => {
        const docRef = doc(collection(firestore, "pantry"), item);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            await setDoc(docRef, { quantity: quantity + 1 });
        } else {
            await setDoc(docRef, { quantity: 1 });
        }
        await updatePantry();
    };

    useEffect(() => {
        updatePantry();
    }, []);

    useEffect(() => {
        filterPantryItems();
    }, [pantry, searchTerm]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box
            width={"100vw"}
            height={"100vh"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
            flexDirection={"column"}
        >
            <div>
                <TextField
                    variant="outlined"
                    placeholder="Search pantry items..."
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box
                    position={"absolute"}
                    top={"50%"}
                    left={"50%"}
                    sx={{ transform: "translate(-50%, -50%)" }}
                    width={400}
                    bgcolor={"white"}
                    border={"2px solid black"}
                    boxShadow={24}
                    p={4}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={3}
                >
                    <Typography variant={"h6"}>Add Item</Typography>
                    <Stack width={"100%"} direction={"row"} gap={2}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={itemName}
                            onChange={(e) => {
                                setItemName(e.target.value);
                            }}
                        ></TextField>
                        <Button
                            variant={"outlined"}
                            onClick={() => {
                                addItem(itemName);
                                setItemName("");
                                handleClose();
                            }}
                        >
                            Add
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <Button
                variant={"contained"}
                onClick={() => {
                    handleOpen();
                }}
            >
                {" "}
                Add New Item{" "}
            </Button>
            <Box border="1px solid #333">
                <Box
                    alignItems={"center"}
                    justifyContent={"center"}
                    display={"flex"}
                    width="800px"
                    height="100px"
                    bgcolor="#ADD8E6"
                >
                    <Typography variant="h2" color="#333">
                        Pantry Items
                    </Typography>
                </Box>
            </Box>
            <Stack
                width={"800px"}
                height={"300px"}
                spacing={2}
                overflow={"auto"}
            >
                {filteredPantry.map(({ name, quantity }) => (
                    <Box
                        key={name}
                        width="100%"
                        minHeight="150px"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        bgcolor={"#f0f0f0"}
                        padding={5}
                    >
                        <Typography
                            variant="h3"
                            color="#333"
                            textAlign="center"
                        >
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Typography>
                        <Typography
                            variant="h3"
                            color="#333"
                            textAlign="center"
                        >
                            {quantity}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    addItem(name);
                                }}
                            >
                                Add
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    removeItem(name);
                                }}
                            >
                                Remove
                            </Button>
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}
