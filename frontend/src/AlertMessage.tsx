
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
export const AlertMessage = (props: any) => {
    const [alert, setalert] = useState(props.alertt.flag)
    useEffect(() => {
        setalert(props.alertt.flag)
    }, [props.alertt])
    return (
        <AlertDialog open={alert}  >

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-500">OOPS!! </AlertDialogTitle>
                    <AlertDialogDescription>
                       {props.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => {
                        setalert(false)
                        props.alertChange({...props.alertt,flag:false})
                    }}>OK</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog  >
    )
}
