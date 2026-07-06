import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export default function AdminRoute({ children }) {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!user) return;

    const email = user.primaryEmailAddress?.emailAddress;

    fetch(`http://localhost:3000/api/users/role?email=${email}`)
      .then(res => res.json())
      .then(data => setRole(data.role))
      .catch(() => setRole("USER"));
  }, [user]);

  if (!isLoaded || role === null) {
    return <div>Loading...</div>;
  }

  if (role !== "ADMIN") {
    return <div>Access Denied 🚫</div>;
  }

  return children;
}