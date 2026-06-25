import type { FormFieldSchema, FieldTreeNode, FieldTreeBranch } from '../types';

export const isBranchCapable = (field: FormFieldSchema): boolean =>
    (field.type === 'select' || field.type === 'card_radio')
    && !!field.options && field.options.length > 0;

export const buildFieldTree = (fields: FormFieldSchema[]): FieldTreeNode[] => {
    const ids = new Set(fields.map(f => f.id));
    const childrenByParent = new Map<string, FormFieldSchema[]>();
    const roots: FormFieldSchema[] = [];

    for (const field of fields) {
        const parentId = field.dependsOn?.field;
        if (parentId && ids.has(parentId)) {
            const list = childrenByParent.get(parentId) ?? [];
            list.push(field);
            childrenByParent.set(parentId, list);
        } else {
            roots.push(field);
        }
    }

    const buildNode = (field: FormFieldSchema): FieldTreeNode => {
        const rawChildren = childrenByParent.get(field.id) ?? [];

        const byValue = new Map<string, FormFieldSchema[]>();
        for (const child of rawChildren) {
            const raw = child.dependsOn?.value;
            const values = raw === undefined ? [''] : Array.isArray(raw) ? raw : [raw];
            for (const value of values) {
                const list = byValue.get(value) ?? [];
                list.push(child);
                byValue.set(value, list);
            }
        }

        const branches: FieldTreeBranch[] = [];
        const usedValues = new Set<string>();

        for (const option of field.options ?? []) {
            usedValues.add(option.value);
            const group = byValue.get(option.value) ?? [];
            branches.push({ option, children: group.map(buildNode) });
        }

        for (const [value, group] of Array.from(byValue.entries())) {
            if (usedValues.has(value)) continue;
            branches.push({
                option: { value, label: `Opção removida (${value})` },
                children: group.map(buildNode),
                isOrphan: true,
            });
        }

        return { field, branches };
    };

    return roots.map(buildNode);
};

export const flattenFieldTree = (nodes: FieldTreeNode[]): FormFieldSchema[] => {
    const result: FormFieldSchema[] = [];
    const seen = new Set<string>();

    const walk = (node: FieldTreeNode) => {
        const key = node.field.uid ?? node.field.id;
        if (seen.has(key)) return;
        seen.add(key);
        result.push(node.field);
        for (const branch of node.branches) {
            for (const child of branch.children) walk(child);
        }
    };

    nodes.forEach(walk);
    return result;
};

export const canonicalizeFields = (fields: FormFieldSchema[]): FormFieldSchema[] =>
    flattenFieldTree(buildFieldTree(fields));

export const collectFieldAndDescendants = (fields: FormFieldSchema[], rootId: string): Set<string> => {
    const result = new Set<string>([rootId]);
    let changed = true;

    while (changed) {
        changed = false;
        for (const field of fields) {
            const parentId = field.dependsOn?.field;
            if (parentId && result.has(parentId) && !result.has(field.id)) {
                result.add(field.id);
                changed = true;
            }
        }
    }

    return result;
};
