import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./components/layout/PrivateRoute";
import { Layout } from "./components/layout/Layout";
import { Login } from "./pages/auth/Login";
import { ActionsPanel } from "./pages/tickets/ActionsPanel";
import { DynamicTicketForm } from "./pages/tickets/DynamicTicketForm";
import { ChecklistPage } from "./pages/checklists/ChecklistPage";
import { CockpitAdminDashboard } from "./pages/admin/CockpitAdminDashboard";
import { ProductionLinesPage } from "./pages/admin/ProductionLinesPage";
import { PrefixesPage } from "./pages/admin/PrefixesPage";
import { DepartmentBuilder } from "./pages/admin/DepartmentBuilder";
import { DepartmentEditor } from "./pages/admin/DepartmentEditor";
import { ChecklistBuilder } from "./pages/admin/ChecklistBuilder";
import { HeatmapBuilder } from "./pages/admin/HeatmapBuilder";
import { LineHeatmapPanel } from "./pages/admin/LineHeatmapPanel";
import { TicketBoard } from "./pages/tickets/TicketBoard";
import { TicketHistory } from "./pages/tickets/TicketHistory";
import { LiveDowntimeDashboard } from "./pages/analytics/live-dashboard/LiveDowntimeDashboard";
import { DowntimeHistorical } from "./pages/analytics/historical-dashboard/DowntimeHistoricalDashboard";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>

                    <Route path="/" element={<ActionsPanel />} />
                    <Route path="actions/:departmentId/new" element={<DynamicTicketForm />} />

                    <Route path="tickets/board" element={<TicketBoard />} />

                    <Route path="ticket-history" element={<TicketHistory />} />

                    <Route path="checklists" element={<ChecklistPage />} />

                    <Route path="analytics">
                        <Route path="downtime-geral" element={<LiveDowntimeDashboard />} />
                        <Route path="downtime-historico" element={<DowntimeHistorical />} />
                    </Route>

                    <Route path="cockpit-admin">
                        <Route index element={<CockpitAdminDashboard />} />
                        <Route path="production-lines" element={<ProductionLinesPage />} />
                        <Route path="prefixes" element={<PrefixesPage />} />
                        <Route path="department-builder" element={<DepartmentBuilder />} />
                        <Route path="department-editor" element={<DepartmentEditor />} />
                        <Route path="checklist-builder" element={<ChecklistBuilder />} />
                        <Route path="heatmap-builder" element={<HeatmapBuilder />} />
                        <Route path="heatmap-lines" element={<LineHeatmapPanel />} />
                    </Route>

                </Route>
            </Route>
        </Routes>
    );
}

export default App;