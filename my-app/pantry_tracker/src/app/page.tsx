"use client";

import { useState, useEffect } from "react";
import firestore from "../../firebase";
import { Box, Typography } from "@mui/material";
import { collection, getDocs, query } from "firebase/firestore";

interface InventoryItem {
    name: string;
    counts: number;
}

export default function Home() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState("");

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, "inventory"));
        const docs = await getDocs(snapshot);
        const inventoryList: InventoryItem[] = [];
        docs.forEach((doc) => {
            const data = doc.data();
            inventoryList.push({ name: doc.id, counts: data.counts });
            // inventoryList.push({ name: doc.id, ...doc.data() });
        });
        setInventory(inventoryList);
    };

    useEffect(() => {
        updateInventory();
    }, []);

    const renderInventory = () => {
        return inventory.map((item) => (
            <Box key={item.name}>
                <Typography>{item.name}</Typography>
                <Typography>{item.counts}</Typography>
            </Box>
        ));
    };

    return (
        <Box>
            <Typography variant="h1">Inventory Management</Typography>
            {renderInventory()}
        </Box>
    );
}
