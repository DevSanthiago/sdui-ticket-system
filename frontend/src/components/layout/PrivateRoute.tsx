import { Navigate, Outlet } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "../../hooks/auth/useAuth";

export const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Center h="100vh" bg="gray.50" transition="background 0.2s">
                <Spinner
                    size="xl"
                    color="blue.500"
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                />
            </Center>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};