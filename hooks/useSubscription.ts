"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

const PRO_LIMIT = 25;
const FREE_LIMIT = 3;

function useSubscription() {
  const [hasActiveMembership, setHasActiveMembership] = useState();

  const [isOverFileLimit, setIsOverFileLimit] = useState(false);

  const { user } = useUser();

  const [snapshot, loading, error] = useDocument(
    user && doc(db, "users", user.id),
    {
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
    }
  );

  const [fileSnapshot, fileLoading] = useCollection(
    user && collection(db, "users", user?.id, "files")
  );

  useEffect(() => {
    if (!snapshot) return;

    const data = snapshot.data();

    if (!data) return;

    setHasActiveMembership(data.hasActiveMembership);
    console.log(data);
  }, [snapshot]);

  useEffect(() => {
    if (!fileSnapshot || hasActiveMembership === null) return;

    const files = fileSnapshot.docs;

    const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

    console.log(
      ` --- Checking if user is over file limit`,
      files.length,
      usersLimit
    );
  }, [fileSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT]);

  return { hasActiveMembership, loading, error, isOverFileLimit, fileLoading };
}

export default useSubscription;
