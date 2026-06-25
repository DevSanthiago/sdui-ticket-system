import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { useDepartmentEditor } from '../../hooks/admin/useDepartmentEditor';
import { DepartmentSelectionView } from '../../components/admin/department-editor/DepartmentSelectionView';
import { DepartmentEditingView } from '../../components/admin/department-editor/DepartmentEditingView';

export const DepartmentEditor = () => {
    const isDarkMode = useColorModeValue(false, true);

    const {
        view,
        loading, isSaving,
        departments, filteredDepartments,
        editData, editFields, setEditFields,
        handleSelectDepartment,
        handleEditDataChange,
        handleSaveChanges,
        handleToggleStatus,
        handleBackToSelection,
    } = useDepartmentEditor(isDarkMode);

    if (view === 'selection') {
        return (
            <DepartmentSelectionView
                departments={departments}
                filteredDepartments={filteredDepartments}
                loading={loading}
                onSelectDepartment={handleSelectDepartment}
            />
        );
    }

    return (
        <DepartmentEditingView
            editData={editData}
            editFields={editFields}
            isSaving={isSaving}
            onEditDataChange={handleEditDataChange}
            onFieldsChange={setEditFields}
            onToggleStatus={handleToggleStatus}
            onSave={handleSaveChanges}
            onBack={handleBackToSelection}
        />
    );
};