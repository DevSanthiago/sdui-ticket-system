import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from '../../services/alerts/alertService';
import { buildFieldTree, flattenFieldTree, canonicalizeFields, collectFieldAndDescendants } from '../../helpers/fieldTreeHelpers';
import type { FormFieldSchema, FieldTreeNode } from '../../types';

const nodeUid = (node: FieldTreeNode): string => node.field.uid ?? node.field.id;

const reorderNodeList = (nodes: FieldTreeNode[], orderedUids: string[]): FieldTreeNode[] => {
    const byUid = new Map(nodes.map(n => [nodeUid(n), n]));
    const next = orderedUids.map(uid => byUid.get(uid)).filter((n): n is FieldTreeNode => Boolean(n));
    nodes.forEach(n => { if (!orderedUids.includes(nodeUid(n))) next.push(n); });
    return next;
};

interface UseFieldTreeBuilderParams {
    fields: FormFieldSchema[];
    onChange: (fields: FormFieldSchema[]) => void;
    isDarkMode: boolean;
}

export const useFieldTreeBuilder = ({ fields, onChange, isDarkMode }: UseFieldTreeBuilderParams) => {
    const tree = useMemo(() => buildFieldTree(fields), [fields]);

    const fieldsRef = useRef(fields);
    const onChangeRef = useRef(onChange);
    const isDarkModeRef = useRef(isDarkMode);
    useEffect(() => {
        fieldsRef.current = fields;
        onChangeRef.current = onChange;
        isDarkModeRef.current = isDarkMode;
    });

    const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
    const idCounter = useRef(0);

    const nextId = useCallback(() => {
        idCounter.current += 1;
        return `campo_${Date.now()}_${idCounter.current}`;
    }, []);

    const isCollapsed = useCallback((id: string) => collapsedIds.has(id), [collapsedIds]);

    const toggleCollapse = useCallback((id: string) => {
        setCollapsedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const expandNode = useCallback((id: string) => {
        setCollapsedIds(prev => {
            if (!prev.has(id)) return prev;
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }, []);

    const createField = useCallback((asCard: boolean, dependsOn?: { field: string; value: string }): FormFieldSchema => {
        const id = nextId();
        const uid = `uid_${id}`;
        const base: FormFieldSchema = asCard
            ? { id, uid, type: 'card_radio', label: 'Novo Card', required: true, options: [{ value: `opcao_${id}`, label: 'Nova Opção' }] }
            : { id, uid, type: 'text', label: 'Nova Pergunta', required: true };
        return dependsOn ? { ...base, dependsOn } : base;
    }, [nextId]);

    const addRoot = useCallback((asCard: boolean) => {
        onChangeRef.current(canonicalizeFields([...fieldsRef.current, createField(asCard)]));
    }, [createField]);

    const addChildUnderOption = useCallback((parentId: string, optionValue: string, asCard: boolean) => {
        const newField = createField(asCard, { field: parentId, value: optionValue });
        expandNode(parentId);
        onChangeRef.current(canonicalizeFields([...fieldsRef.current, newField]));
    }, [createField, expandNode]);

    const removeSubtree = useCallback(async (fieldId: string) => {
        const current = fieldsRef.current;
        const toRemove = collectFieldAndDescendants(current, fieldId);
        const nestedCount = toRemove.size - 1;

        const result = await Alert.confirm(
            'Remover campo',
            nestedCount > 0
                ? `Este campo possui ${nestedCount} pergunta(s) aninhada(s). Remover vai excluir todo o ramo. Deseja continuar?`
                : 'Deseja remover este campo?',
            isDarkModeRef.current
        );

        if (!result.isConfirmed) return;
        onChangeRef.current(fieldsRef.current.filter(f => !toRemove.has(f.id)));
    }, []);

    const reorderSiblings = useCallback((parentUid: string | null, optionValue: string | null, orderedUids: string[]) => {
        const currentTree = buildFieldTree(fieldsRef.current);

        if (parentUid === null) {
            onChangeRef.current(flattenFieldTree(reorderNodeList(currentTree, orderedUids)));
            return;
        }

        const walk = (nodes: FieldTreeNode[]): FieldTreeNode[] => nodes.map(node => {
            if (nodeUid(node) === parentUid) {
                return {
                    ...node,
                    branches: node.branches.map(b =>
                        b.option.value === optionValue ? { ...b, children: reorderNodeList(b.children, orderedUids) } : b),
                };
            }
            return { ...node, branches: node.branches.map(b => ({ ...b, children: walk(b.children) })) };
        });

        onChangeRef.current(flattenFieldTree(walk(currentTree)));
    }, []);

    return {
        tree,
        isCollapsed,
        toggleCollapse,
        addRoot,
        addChildUnderOption,
        removeSubtree,
        reorderSiblings,
    };
};
