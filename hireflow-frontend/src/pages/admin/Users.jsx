// import { useEffect, useState } from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import axiosInstance from "../../api/axiosInstance";
// import { toast } from "react-toastify";
//
// export default function Users() {
//     const [users, setUsers] = useState([]);
//
//     const loadUsers = () => {
//         axiosInstance
//             .get("/admin/users")
//             .then((res) => setUsers(res.data))
//             .catch(() => toast.error("Access denied or session expired"));
//     };
//
//     useEffect(() => {
//         loadUsers();
//     }, []);
//
//     const deleteUser = (id) => {
//         if (window.confirm("Are you sure you want to delete this user?")) {
//             axiosInstance.delete(`/admin/users/${id}`)
//                 .then(() => {
//                     toast.success("User account removed");
//                     loadUsers();
//                 })
//                 .catch(() => toast.error("Failed to remove user"));
//         }
//     };
//
//     return (
//         <DashboardLayout>
//             <div className="welcome-banner p-4 mb-5 glass border-0 overflow-hidden position-relative rounded-lg shadow-xl" style={{
//                 backgroundImage: 'linear-gradient(rgba(14, 165, 233, 0.75), rgba(30, 27, 75, 0.9)), url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070)',
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 border: '1px solid rgba(255,255,255,0.05)'
//             }}>
//                 <div className="position-relative" style={{ zIndex: 1 }}>
//                     <div className="badge-pill bg-white-10 text-white mb-2 d-inline-block px-3 py-1 fw-800 fs-xs text-uppercase backdrop-blur">Platform Directory</div>
//                     <h2 className="fw-900 text-white mb-1">Account Management</h2>
//                     <p className="text-white opacity-75 small mb-0">Security auditing and global user monitoring active.</p>
//                 </div>
//             </div>
//
//             <div className="glass-table-container fade-in mt-4">
//                 <table className="table">
//                     <thead>
//                         <tr>
//                             <th className="ps-4">User Details</th>
//                             <th>Email Address</th>
//                             <th>Platform Role</th>
//                             <th className="text-end pe-4">Status</th>
//                         </tr>
//                     </thead>
//
//                     <tbody>
//                         {users.map((user) => (
//                             <tr key={user.id}>
//                                 <td className="ps-4">
//                                     <div className="d-flex align-items-center gap-3">
//                                         <div className="avatar bg-blue-soft text-primary" style={{ width: '40px', height: '40px', borderRadius: '12px', fontWeight: '800' }}>
//                                             {user.name?.charAt(0)}
//                                         </div>
//                                         <div className="fw-bold text-dark">{user.name}</div>
//                                     </div>
//                                 </td>
//                                 <td className="text-muted">{user.email}</td>
//                                 <td>
//                                     <span className={`badge-pill ${user.role === 'ADMIN' ? 'bg-orange-soft text-warning border' : user.role === 'RECRUITER' ? 'bg-purple-soft text-purple border' : 'bg-blue-soft text-primary border'}`}>
//                                         {user.role}
//                                     </span>
//                                 </td>
//                                 <td className="text-end pe-4">
//                                     <div className="d-flex align-items-center justify-content-end gap-3">
//                                         <span className="text-success small fw-700">
//                                             <i className="bi bi-patch-check-fill me-1"></i> Verified
//                                         </span>
//                                         <button
//                                             className="btn btn-outline-danger btn-xs border-0"
//                                             onClick={() => deleteUser(user.id)}
//                                             title="Remove User"
//                                         >
//                                             <i className="bi bi-trash"></i>
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//
//                 {users.length === 0 && (
//                     <div className="text-center py-5">
//                         <i className="bi bi-people fs-1 d-block mb-3 opacity-25"></i>
//                         <p className="text-muted">No users found in the system.</p>
//                     </div>
//                 )}
//             </div>
//         </DashboardLayout>
//     );
// }


import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function Users() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [deletingUserId, setDeletingUserId] =
        useState(null);


    /* =====================================================
       LOAD USERS
    ===================================================== */

    const loadUsers = async () => {

        setLoading(true);

        try {

            const response =
                await axiosInstance.get(
                    "/admin/users"
                );

            setUsers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Load users error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Access denied or session expired"
            );

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       LOAD ON PAGE OPEN
    ===================================================== */

    useEffect(() => {

        loadUsers();

    }, []);


    /* =====================================================
       DELETE USER
    ===================================================== */

    const deleteUser = async (user) => {

        /*
         * System admin should never
         * be deleted.
         */

        if (user.role === "ADMIN") {

            toast.warning(
                "System administrator cannot be deleted"
            );

            return;
        }


        /*
         * Confirmation
         */

        const confirmed =
            window.confirm(
                `Delete ${user.name}?\n\n` +
                `Email: ${user.email}\n\n` +
                "Their related applications, interviews " +
                "and recruiter jobs will also be deleted."
            );


        if (!confirmed) {
            return;
        }


        setDeletingUserId(user.id);


        try {

            const response =
                await axiosInstance.delete(
                    `/admin/users/${user.id}`
                );


            /*
             * Remove from UI immediately.
             */

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (item) =>
                        item.id !== user.id
                )
            );


            toast.success(
                response.data?.message ||
                `${user.name} deleted successfully`
            );

        } catch (error) {

            console.error(
                "Delete user error:",
                error
            );


            /*
             * Show real backend error.
             */

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to remove user"
            );

        } finally {

            setDeletingUserId(null);
        }
    };


    /* =====================================================
       ROLE CSS
    ===================================================== */

    const getRoleClass = (role) => {

        switch (role) {

            case "ADMIN":

                return (
                    "bg-orange-soft " +
                    "text-warning border"
                );


            case "RECRUITER":

                return (
                    "bg-purple-soft " +
                    "text-purple border"
                );


            default:

                return (
                    "bg-blue-soft " +
                    "text-primary border"
                );
        }
    };


    /* =====================================================
       INITIAL
    ===================================================== */

    const getInitial = (name) => {

        if (!name) {
            return "U";
        }

        return name
            .trim()
            .charAt(0)
            .toUpperCase();
    };


    /* =====================================================
       UI
    ===================================================== */

    return (

        <DashboardLayout>

            {/* =============================================
                HEADER
            ============================================= */}

            <div
                className="
                    welcome-banner
                    p-4
                    mb-5
                    glass
                    border-0
                    overflow-hidden
                    position-relative
                    rounded-lg
                    shadow-xl
                "
                style={{
                    backgroundImage:
                        "linear-gradient(" +
                        "rgba(14, 165, 233, 0.75), " +
                        "rgba(30, 27, 75, 0.9)" +
                        "), " +
                        "url(" +
                        "https://images.unsplash.com/" +
                        "photo-1522071820081-009f0129c71c" +
                        "?auto=format&fit=crop&q=80&w=2070" +
                        ")",

                    backgroundSize: "cover",

                    backgroundPosition: "center",

                    border:
                        "1px solid rgba(255,255,255,0.05)",
                }}
            >

                <div
                    className="position-relative"
                    style={{
                        zIndex: 1
                    }}
                >

                    <div
                        className="
                            badge-pill
                            bg-white-10
                            text-white
                            mb-2
                            d-inline-block
                            px-3
                            py-1
                            fw-800
                            fs-xs
                            text-uppercase
                            backdrop-blur
                        "
                    >

                        Platform Directory

                    </div>


                    <h2
                        className="
                            fw-900
                            text-white
                            mb-1
                        "
                    >

                        Account Management

                    </h2>


                    <p
                        className="
                            text-white
                            opacity-75
                            small
                            mb-0
                        "
                    >

                        Security auditing and global
                        user monitoring active.

                    </p>

                </div>

            </div>


            {/* =============================================
                TABLE
            ============================================= */}

            <div
                className="
                    glass-table-container
                    fade-in
                    mt-4
                "
            >

                <table className="table mobile-card-table admin-users-table">

                    <thead>

                    <tr>

                        <th className="ps-4">
                            User Details
                        </th>

                        <th>
                            Email Address
                        </th>

                        <th>
                            Platform Role
                        </th>

                        <th className="text-end pe-4">
                            Status
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {!loading &&
                        users.map(
                            (user) => {

                                const deleting =
                                    deletingUserId ===
                                    user.id;


                                return (

                                    <tr
                                        key={user.id}
                                    >

                                        {/* USER */}

                                        <td
                                            className="ps-4"
                                            data-label="User Details"
                                        >

                                            <div
                                                className="
                                                        d-flex
                                                        align-items-center
                                                        gap-3
                                                    "
                                            >

                                                <div
                                                    className="
                                                            avatar
                                                            bg-blue-soft
                                                            text-primary
                                                        "
                                                    style={{
                                                        width:
                                                            "40px",

                                                        height:
                                                            "40px",

                                                        borderRadius:
                                                            "12px",

                                                        fontWeight:
                                                            "800",

                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >

                                                    {getInitial(
                                                        user.name
                                                    )}

                                                </div>


                                                <div>

                                                    <div
                                                        className="
                                                                fw-bold
                                                                text-main
                                                            "
                                                    >

                                                        {user.name ||
                                                            "Unknown User"}

                                                    </div>

                                                    {user.role ===
                                                        "ADMIN" && (

                                                            <small
                                                                className="
                                                                    text-muted
                                                                "
                                                            >

                                                                Protected
                                                                system
                                                                account

                                                            </small>

                                                        )}

                                                </div>

                                            </div>

                                        </td>


                                        {/* EMAIL */}

                                        <td
                                            className="
                                                    text-muted
                                                "
                                            data-label="Email Address"
                                        >

                                            {user.email}

                                        </td>


                                        {/* ROLE */}

                                        <td data-label="Platform Role">

                                                <span
                                                    className={
                                                        `badge-pill ${
                                                            getRoleClass(
                                                                user.role
                                                            )
                                                        }`
                                                    }
                                                >

                                                    {user.role
                                                        ?.replaceAll(
                                                            "_",
                                                            " "
                                                        )}

                                                </span>

                                        </td>


                                        {/* STATUS / DELETE */}

                                        <td
                                            className="
                                                    text-end
                                                    pe-4
                                                "
                                            data-label="Status"
                                        >

                                            <div
                                                className="
                                                        d-flex
                                                        align-items-center
                                                        justify-content-end
                                                        gap-3
                                                    "
                                            >

                                                    <span
                                                        className="
                                                            text-success
                                                            small
                                                            fw-700
                                                        "
                                                    >

                                                        <i
                                                            className="
                                                                bi
                                                                bi-patch-check-fill
                                                                me-1
                                                            "
                                                        />

                                                        Verified

                                                    </span>


                                                {/* ADMIN LOCK */}

                                                {user.role ===
                                                "ADMIN" ? (

                                                    <button
                                                        type="button"
                                                        className="
                                                                btn
                                                                btn-sm
                                                                border-0
                                                                text-muted
                                                            "
                                                        disabled
                                                        title="
                                                                System
                                                                administrator
                                                                cannot be
                                                                deleted
                                                            "
                                                    >

                                                        <i
                                                            className="
                                                                    bi
                                                                    bi-lock-fill
                                                                "
                                                        />

                                                    </button>

                                                ) : (

                                                    /* DELETE */

                                                    <button
                                                        type="button"
                                                        className="
                                                                btn
                                                                btn-outline-danger
                                                                btn-xs
                                                                border-0
                                                            "
                                                        disabled={
                                                            deleting
                                                        }
                                                        onClick={() =>
                                                            deleteUser(
                                                                user
                                                            )
                                                        }
                                                        title="
                                                                Remove
                                                                User
                                                            "
                                                    >

                                                        {deleting ? (

                                                            <span
                                                                className="
                                                                        spinner-border
                                                                        spinner-border-sm
                                                                    "
                                                            />

                                                        ) : (

                                                            <i
                                                                className="
                                                                        bi
                                                                        bi-trash
                                                                    "
                                                            />

                                                        )}

                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>
                                );
                            }
                        )}

                    </tbody>

                </table>


                {/* =========================================
                    LOADING
                ========================================= */}

                {loading && (

                    <div
                        className="
                            text-center
                            py-5
                        "
                    >

                        <div
                            className="
                                spinner-border
                                text-primary
                            "
                            role="status"
                        />

                        <p
                            className="
                                text-muted
                                small
                                mt-3
                                mb-0
                            "
                        >

                            Loading users...

                        </p>

                    </div>

                )}


                {/* =========================================
                    EMPTY STATE
                ========================================= */}

                {!loading &&
                    users.length === 0 && (

                        <div
                            className="
                            text-center
                            py-5
                        "
                        >

                            <i
                                className="
                                bi
                                bi-people
                                fs-1
                                d-block
                                mb-3
                                opacity-25
                            "
                            />

                            <p
                                className="
                                text-muted
                                mb-0
                            "
                            >

                                No users found in
                                the system.

                            </p>

                        </div>

                    )}

            </div>

        </DashboardLayout>
    );
}