export default function ConfirmDialog({
    open,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    onConfirm,
    onCancel,
    loading = false,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-5">
                <h3 className="text-lg font-semibold mb-2">
                    {title}
                </h3>

                <p className="text-sm text-gray-600 mb-5">
                    {message}
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm rounded
                                   border hover:bg-gray-100"
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm rounded
                                   bg-red-600 text-white
                                   hover:bg-red-700
                                   disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}
