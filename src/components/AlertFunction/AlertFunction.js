'use client'
import Swal from 'sweetalert2';

export default function AlertFunction(tittle, text, icon) {
    Swal.fire({
        title: tittle,
        text: text,
        icon: icon
    });
}
