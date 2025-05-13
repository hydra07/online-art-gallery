// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { FileText, Flag, RefreshCw } from "lucide-react"

// interface ReportEmptyStateProps {
//   onRefresh: () => void;
// }

// export function ReportEmptyState({ onRefresh }: ReportEmptyStateProps) {
//   return (
//     <Card className="shadow-lg border-0">
//       <CardHeader>
//         <CardTitle className="text-xl md:text-2xl font-bold flex items-center">
//           <Flag className="mr-2 h-6 w-6 text-blue-500" />
//           Manage Reports
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="flex flex-col justify-center items-center h-64 gap-4">
//         <FileText className="h-16 w-16 text-gray-300" />
//         <p className="text-gray-500 text-lg">No reports found.</p>
//         <Button variant="outline" onClick={onRefresh}>
//           <RefreshCw className="mr-2 h-4 w-4" />
//           Refresh Data
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }