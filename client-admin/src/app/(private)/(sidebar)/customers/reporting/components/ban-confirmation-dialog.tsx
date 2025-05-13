// 'use client'
// import { ReasonReport } from "@/utils/enums"
// import { Report } from "../types"
// import { motion } from "framer-motion"
// import { Ban, RefreshCw } from "lucide-react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"

// interface BanConfirmationDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onConfirm: () => void
//   report: Report | null
//   isProcessing?: boolean
//   getReasonLabel: (reason: ReasonReport) => string
// }

// export function BanConfirmationDialog({
//   open,
//   onOpenChange,
//   onConfirm,
//   report,
//   isProcessing = false,
//   getReasonLabel,
// }: BanConfirmationDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.3 }}
//             className="flex items-center justify-center mb-2"
//           >
//             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
//               <Ban className="h-6 w-6 text-red-600" />
//             </div>
//           </motion.div>
//           <DialogTitle className="text-xl font-bold text-center text-gray-800">
//             Confirm Ban User
//           </DialogTitle>
//           <DialogDescription className="text-center mt-2 text-gray-600">
//             Are you sure you want to permanently ban this user? This action cannot be undone.
//           </DialogDescription>
//         </DialogHeader>

//         {report && (
//           <div className="bg-gray-50 p-4 rounded-md my-4">
//             <div className="grid grid-cols-2 gap-2 text-sm">
//               <div className="text-gray-500">User ID:</div>
//               <div>{report.reportedId}</div>
//               <div className="text-gray-500">Reported For:</div>
//               <div>{report.reason ? getReasonLabel(report.reason) : ''}</div>
//               <div className="text-gray-500">Description:</div>
//               <div className="col-span-2 mt-1">{report.description}</div>
//             </div>
//           </div>
//         )}

//         <DialogFooter className="flex flex-row justify-center gap-3 sm:gap-4 mt-4">
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             className="w-full sm:w-auto"
//             disabled={isProcessing}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="destructive"
//             onClick={onConfirm}
//             className="w-full sm:w-auto"
//             disabled={isProcessing}
//           >
//             {isProcessing ? (
//               <>
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   className="mr-2"
//                 >
//                   <RefreshCw className="h-4 w-4" />
//                 </motion.div>
//                 Banning...
//               </>
//             ) : (
//               "Ban User"
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }