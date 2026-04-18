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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            
            <div className="w-full max-w-sm p-5 rounded-xl shadow-xl 
                            bg-white dark:bg-slate-900 
                            border border-slate-200 dark:border-slate-700">

                {/* TITLE */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {title}
                </h3>

                {/* MESSAGE */}
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                    {message}
                </p>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold rounded-lg
                                   border border-slate-200 dark:border-slate-700
                                   bg-white dark:bg-slate-800
                                   text-slate-700 dark:text-slate-200
                                   hover:bg-slate-100 dark:hover:bg-slate-700
                                   transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold rounded-lg
                                   bg-red-600 text-white
                                   hover:bg-red-700
                                   disabled:opacity-50
                                   transition"
                    >
                        {loading ? "Processing..." : "Confirm"}
                    </button>

                </div>
            </div>
        </div>
    );
}