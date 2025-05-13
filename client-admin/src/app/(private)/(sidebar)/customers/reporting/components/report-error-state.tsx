// import { Button } from "@/components/ui/button"
// import { AlertTriangle } from "lucide-react"

// interface ReportErrorStateProps {
//   error: unknown;
//   refetch: () => void;
// }

// export function ReportErrorState({ error, refetch }: ReportErrorStateProps) {
//   return (
//     <div className="flex justify-center items-center h-64">
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
//         <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Reports</h3>
//         <p className="text-red-600 mb-4">{(error as Error)?.message || 'Unknown error'}</p>
//         <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700">
//           Try Again
//         </Button>
//       </div>
//     </div>
//   )
// }