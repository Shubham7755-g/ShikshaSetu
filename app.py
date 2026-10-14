"""
ShikshaSetu: School Infrastructure Reporting & Verification Platform
GNIOT INNOVEX 2026 College Ideathon Prototype
Tagline: "Report the Problem. Track the Solution."
"""

import streamlit as st
import pandas as pd
import os
from datetime import datetime
from PIL import Image
import database as db

# Page Configuration
st.set_page_config(
    page_title="ShikshaSetu — School Infrastructure Reporting",
    page_icon="🏫",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize SQLite database
db.init_db()

# Custom CSS for Human-Designed practical aesthetic (Navy blue, clean borders, zero-clutter)
st.markdown("""
<style>
    /* Clean, quiet typography */
    h1, h2, h3 {
        color: #0F172A;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .metric-card {
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 16px;
        text-align: left;
    }
    .metric-value {
        font-size: 24px;
        font-weight: 700;
        font-family: monospace;
        color: #0F172A;
    }
    .metric-label {
        font-size: 12px;
        font-weight: 600;
        color: #64748B;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .status-badge {
        font-weight: 600;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar Navigation
st.sidebar.markdown("## **ShikshaSetu**")
st.sidebar.caption("School Infrastructure Reporting & Verification\nGNIOT INNOVEX 2026")

menu_choice = st.sidebar.radio(
    "Navigation",
    [
        "1. Home",
        "2. Report an Issue",
        "3. Track a Complaint",
        "4. School Dashboard",
        "5. Authority Dashboard",
        "6. Verify Repairs",
        "7. Campus QR Code"
    ]
)

st.sidebar.markdown("---")
# Prototype Settings for Judges
st.sidebar.markdown("### Prototype Controls")
overdue_threshold = st.sidebar.slider("Overdue Benchmark (Days)", min_value=7, max_value=21, value=14)
st.sidebar.caption("Configurable demonstration threshold for overdue flags.")

if st.sidebar.button("Reset Demo Data (5 Records)"):
    db.reset_db_demo()
    st.sidebar.success("Database re-initialized with 5 sample records!")
    st.rerun()

st.sidebar.markdown("---")
st.sidebar.caption("Built for GNIOT INNOVEX 2026 Ideathon · Demonstration Prototype")

# Helper function to compute days open
def get_days_open(date_str):
    try:
        sub_date = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
        diff = (datetime.now() - sub_date).days
        return max(0, diff)
    except Exception:
        return 0

# ==========================================
# 1. HOME PAGE
# ==========================================
if menu_choice == "1. Home":
    st.markdown("### GNIOT INNOVEX 2026 · Innovation Prototype")
    st.title("School problems shouldn't go unnoticed.")
    st.markdown(
        "Report infrastructure issues, follow their progress, and check whether repairs have been completed. "
        "Built for school communities, headmasters, and village committees."
    )

    # 4 Quick Action Buttons
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.info("**Report an Issue**\n\nFile a broken tap, bench, or toilet complaint with photos.")
    with c2:
        st.info("**Track a Complaint**\n\nSearch any complaint ID to inspect the audit timeline.")
    with c3:
        st.info("**School Dashboard**\n\nMonitor institutional maintenance tickets and pending work.")
    with c4:
        st.info("**Verify Repairs**\n\nInspect before/after evidence and authorize completion sign-off.")

    st.markdown("---")

    # Metrics Summary from SQLite
    all_complaints = db.get_all_complaints()
    total_count = len(all_complaints)
    pending_count = len([c for c in all_complaints if c["status"] in ["Submitted", "Under Review", "Assigned"]])
    in_progress_count = len([c for c in all_complaints if c["status"] in ["In Progress", "Verification Pending"]])
    verified_count = len([c for c in all_complaints if c["status"] == "Verified Resolved"])

    st.subheader("Complaint Records Summary")
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Total Complaints", total_count)
    m2.metric("Pending Action", pending_count)
    m3.metric("In Progress Repairs", in_progress_count)
    m4.metric("Verified Resolved", verified_count)

    st.markdown("---")

    # Recent Complaints Table
    st.subheader("Recent Complaints")
    if all_complaints:
        df = pd.DataFrame(all_complaints)
        display_df = df[["id", "school_name", "category", "submitted_at", "status"]].head(6)
        display_df.columns = ["Complaint ID", "School", "Issue Category", "Date Reported", "Current Status"]
        st.dataframe(display_df, use_container_width=True, hide_index=True)
    else:
        st.write("No complaints logged yet.")

# ==========================================
# 2. REPORT AN ISSUE
# ==========================================
elif menu_choice == "2. Report an Issue":
    st.title("Report an Issue")
    st.write("Submit a school infrastructure problem to notify authorities and track repair progress.")

    with st.expander("Quick Demo Fill (for Judges)", expanded=False):
        if st.button("Fill Drinking Water Tap Issue"):
            st.session_state["demo_school"] = "Government Primary School, Surajpur"
            st.session_state["demo_loc"] = "Surajpur Block, Gautam Buddha Nagar"
            st.session_state["demo_desc"] = "Main drinking water tap broken near assembly ground. Water leaking continuously and students have no drinking water."

    with st.form("report_form", clear_on_submit=False):
        school_name = st.text_input(
            "School or Anganwadi Name *",
            value=st.session_state.get("demo_school", "")
        )
        location = st.text_input(
            "Location or Block *",
            value=st.session_state.get("demo_loc", "")
        )

        col1, col2 = st.columns(2)
        with col1:
            category = st.selectbox(
                "Issue Category *",
                [
                    "Drinking Water",
                    "Toilets and Sanitation",
                    "Electricity",
                    "Roof or Building Damage",
                    "Furniture",
                    "Other"
                ]
            )
        with col2:
            reporter_role = st.selectbox(
                "Reporter Role *",
                [
                    "Teacher",
                    "Parent",
                    "School Management Committee Member",
                    "School Administrator"
                ]
            )

        description = st.text_area(
            "Short Description of the Problem *",
            value=st.session_state.get("demo_desc", ""),
            help="Describe the location in school and the exact damage."
        )

        uploaded_file = st.file_uploader("Photograph of the Issue (Optional)", type=["jpg", "jpeg", "png"])

        submitted = st.form_submit_button("Submit Complaint")

        if submitted:
            if not school_name.strip() or not location.strip() or not description.strip():
                st.error("Please fill in all required fields (School, Location, Description).")
            else:
                saved_path = None
                if uploaded_file is not None:
                    saved_path = os.path.join(db.UPLOADS_DIR, f"complaint_{int(datetime.now().timestamp())}_{uploaded_file.name}")
                    with open(saved_path, "wb") as f:
                        f.write(uploaded_file.getbuffer())

                new_id = db.insert_complaint(school_name, location, category, description, reporter_role, saved_path)
                st.success(f"Complaint successfully registered! Your Complaint ID is **{new_id}**")
                st.info(f"Save this ID: **{new_id}**. You can track its resolution status in the 'Track a Complaint' page.")

# ==========================================
# 3. TRACK A COMPLAINT
# ==========================================
elif menu_choice == "3. Track a Complaint":
    st.title("Track a Complaint")
    st.write("Enter your complaint ID to view its real-time progress and verification audit history.")

    search_id = st.text_input("Enter Complaint ID (e.g., SS-1001, SS-1003, SS-1005):", value="SS-1001")

    if search_id:
        record = db.get_complaint(search_id)
        if not record:
            st.error(f"Complaint ID '{search_id}' not found in the database. Please verify the ID.")
        else:
            days_open = get_days_open(record["submitted_at"])
            is_overdue = days_open >= overdue_threshold and record["status"] != "Verified Resolved"

            st.markdown("---")
            c1, c2 = st.columns([2, 1])
            with c1:
                st.subheader(f"Complaint: {record['id']} ({record['category']})")
                st.write(f"**School:** {record['school_name']} · **Location:** {record['location']}")
                st.write(f"**Reported by:** {record['reporter_role']} on {record['submitted_at']}")
                st.write(f"**Assigned Department:** {record['assigned_department'] or 'Unassigned'}")
            with c2:
                st.metric("Current Status", record["status"])
                st.metric("Days Open", f"{days_open} days")

            if is_overdue:
                st.error(f"⚠️ **Overdue Issue**: Open for {days_open} days, surpassing prototype benchmark ({overdue_threshold} days).")

            st.markdown("#### Description")
            st.info(record["description"])

            if record.get("photo_path") and os.path.exists(record["photo_path"]):
                st.markdown("#### Attached Photograph")
                img = Image.open(record["photo_path"])
                st.image(img, caption="Reported Photo Evidence", width=350)

            # Audit Timeline
            st.markdown("---")
            st.subheader("Status Timeline & Audit History")
            history = db.get_complaint_history(record["id"])
            for h in history:
                st.markdown(f"- **{h['timestamp']}** — `{h['new_status']}` (by {h['author']})\n  *{h['note']}*")

# ==========================================
# 4. SCHOOL DASHBOARD
# ==========================================
elif menu_choice == "4. School Dashboard":
    st.title("School Dashboard")
    st.write("Overview of all school infrastructure complaints and maintenance milestones.")

    all_complaints = db.get_all_complaints()

    if all_complaints:
        df = pd.DataFrame(all_complaints)
        df["days_open"] = df["submitted_at"].apply(get_days_open)

        # Filters
        f1, f2, f3 = st.columns(3)
        with f1:
            schools = ["All"] + sorted(list(df["school_name"].unique()))
            selected_school = st.selectbox("Filter School", schools)
        with f2:
            cats = ["All"] + sorted(list(df["category"].unique()))
            selected_cat = st.selectbox("Filter Category", cats)
        with f3:
            statuses = ["All"] + sorted(list(df["status"].unique()))
            selected_status = st.selectbox("Filter Status", statuses)

        filtered_df = df.copy()
        if selected_school != "All":
            filtered_df = filtered_df[filtered_df["school_name"] == selected_school]
        if selected_cat != "All":
            filtered_df = filtered_df[filtered_df["category"] == selected_cat]
        if selected_status != "All":
            filtered_df = filtered_df[filtered_df["status"] == selected_status]

        st.dataframe(
            filtered_df[["id", "school_name", "category", "submitted_at", "days_open", "status"]],
            use_container_width=True,
            hide_index=True
        )

        st.markdown("---")
        st.subheader("Update Complaint Status (Demonstration Flow)")
        st.caption("School staff can advance stages for demonstration. Note: 'Verified Resolved' is only permitted via Verify Repairs.")

        comp_ids = filtered_df["id"].tolist()
        if comp_ids:
            target_id = st.selectbox("Select Complaint to Update", comp_ids)
            next_status = st.selectbox("Target Status", ["Under Review", "Assigned", "In Progress", "Verified Resolved (Restricted)"])
            note = st.text_input("Status Change Note", value="Reviewed during weekly school meeting.")

            if st.button("Apply Status Change"):
                if "Verified Resolved" in next_status:
                    st.error("System Rule: Complaints cannot be marked 'Verified Resolved' directly. They must be validated through the 'Verify Repairs' module.")
                else:
                    success = db.update_status(target_id, next_status, note, "School Administrator")
                    if success:
                        st.success(f"Status for {target_id} updated to {next_status}.")
                        st.rerun()

# ==========================================
# 5. AUTHORITY DASHBOARD
# ==========================================
elif menu_choice == "5. Authority Dashboard":
    st.title("Authority Dashboard")
    st.write("Demonstration management portal for district education offices and maintenance engineers.")
    st.caption("Illustrative assignments only for demonstration prototype.")

    all_complaints = db.get_all_complaints()

    tab1, tab2, tab3 = st.tabs(["Awaiting Assignment", "Open Complaints", "Report Completed Repair"])

    with tab1:
        awaiting = [c for c in all_complaints if c["status"] in ["Submitted", "Under Review"] and not c.get("assigned_department")]
        if awaiting:
            st.write(f"**{len(awaiting)} Complaints Awaiting Department Assignment**")
            for c in awaiting:
                with st.expander(f"{c['id']} — {c['school_name']} ({c['category']})"):
                    st.write(f"**Description:** {c['description']}")
                    # Suggested department mapping
                    dept_map = {
                        "Drinking Water": "Water Supply / Maintenance",
                        "Electricity": "Electrical Maintenance",
                        "Toilets and Sanitation": "Sanitation / School Maintenance",
                        "Roof or Building Damage": "Building Maintenance",
                        "Furniture": "School Administration / Maintenance"
                    }
                    default_dept = dept_map.get(c["category"], "Public Works Department")
                    dept_choice = st.selectbox(f"Assign Department for {c['id']}", [
                        "Water Supply / Maintenance",
                        "Electrical Maintenance",
                        "Sanitation / School Maintenance",
                        "Building Maintenance",
                        "School Administration / Maintenance",
                        "Public Works Department"
                    ], index=0)
                    internal_note = st.text_input(f"Internal Work Order Note ({c['id']})", value=f"Work order dispatched to {dept_choice}.")
                    delay_reason = st.text_input(f"Reason for Delay (optional) ({c['id']})", value="")

                    if st.button(f"Confirm Assignment for {c['id']}"):
                        db.assign_dept(c["id"], dept_choice, internal_note, delay_reason, advance=True)
                        st.success(f"{c['id']} assigned to {dept_choice}!")
                        st.rerun()
        else:
            st.write("No complaints awaiting assignment.")

    with tab2:
        open_c = [c for c in all_complaints if c["status"] != "Verified Resolved"]
        st.write(f"**{len(open_c)} Active Complaints in System**")
        df_open = pd.DataFrame(open_c)
        if not df_open.empty:
            st.dataframe(df_open[["id", "school_name", "category", "assigned_department", "status"]], use_container_width=True, hide_index=True)

    with tab3:
        st.subheader("Technician: Report Repair Completed")
        st.write("When field staff finishes physical repair, submit completion notes here to trigger verification.")
        in_prog = [c for c in all_complaints if c["status"] in ["In Progress", "Assigned", "Reopened"]]
        if in_prog:
            rep_id = st.selectbox("Select Complaint", [c["id"] for c in in_prog])
            rep_notes = st.text_area("Repair Work Notes", value="Repaired plumbing fittings and replaced damaged valve. Pressure test successful.")
            rep_file = st.file_uploader("Upload Completion Photo (Optional)", type=["jpg", "png", "jpeg"], key="repair_file")

            if st.button("Submit Completed Repair"):
                saved_rep_path = None
                if rep_file is not None:
                    saved_rep_path = os.path.join(db.UPLOADS_DIR, f"repair_{int(datetime.now().timestamp())}_{rep_file.name}")
                    with open(saved_rep_path, "wb") as f:
                        f.write(rep_file.getbuffer())

                db.report_repair(rep_id, rep_notes, saved_rep_path, "Field Maintenance Lead")
                st.success(f"Repair reported for {rep_id}! Ticket moved to 'Verification Pending'.")
                st.rerun()
        else:
            st.write("No in-progress repairs available to mark complete.")

# ==========================================
# 6. VERIFY REPAIRS
# ==========================================
elif menu_choice == "6. Verify Repairs":
    st.title("Verify Repairs")
    st.write("Crucial accountability step: A complaint cannot be closed without physical verification by school stakeholders.")

    all_complaints = db.get_all_complaints()
    pending_verify = [c for c in all_complaints if c["status"] == "Verification Pending"]

    if not pending_verify:
        st.info("No complaints are currently awaiting verification. (Advance an issue in Authority Dashboard to test this flow).")
    else:
        chosen_id = st.selectbox("Select Complaint Awaiting Verification", [c["id"] for c in pending_verify])
        comp = db.get_complaint(chosen_id)

        colA, colB = st.columns(2)
        with colA:
            st.markdown("#### 1. Original Issue")
            st.write(f"**School:** {comp['school_name']}")
            st.write(f"**Category:** {comp['category']}")
            st.info(comp['description'])
            if comp.get("photo_path") and os.path.exists(comp["photo_path"]):
                st.image(comp["photo_path"], caption="Reported Photo", width=300)

        with colB:
            st.markdown("#### 2. Repair Completed by Crew")
            st.write(f"**Assigned Wing:** {comp['assigned_department']}")
            st.success(comp.get("repair_notes", "Physical repairs completed."))
            if comp.get("repair_photo_path") and os.path.exists(comp["repair_photo_path"]):
                st.image(comp["repair_photo_path"], caption="Repair Completion Photo", width=300)

        st.markdown("---")
        st.subheader("Verification Decision")
        verifier_name = st.text_input("Verifier Name", value="Smt. Geeta Rawat")
        verifier_role = st.selectbox("Verifier Role", ["School Management Committee Member", "Teacher / Headmaster", "Parent", "Village Pradhan"])
        result = st.radio("Verification Result", ["Verified Resolved", "Repair Incomplete — Reopen Complaint"])
        v_notes = st.text_area("Inspection Remarks", value="Personally inspected the repair on site. Satisfactory work completed.")

        if st.button("Submit Verification Decision"):
            db.verify_repair(chosen_id, result, v_notes, verifier_name, verifier_role)
            if result == "Verified Resolved":
                st.success(f"Complaint {chosen_id} is now VERIFIED RESOLVED and closed.")
            else:
                st.warning(f"Complaint {chosen_id} has been REOPENED with notes.")
            st.rerun()

# ==========================================
# 7. CAMPUS QR CODE
# ==========================================
elif menu_choice == "7. Campus QR Code":
    st.title("Campus QR Code & Noticeboard Poster")
    st.write("Generate a printable campus poster for school gates, staff rooms, and Anganwadis.")

    st.markdown("""
    ---
    ### ShikshaSetu Noticeboard Poster
    **Scan with phone camera to report broken school infrastructure in 30 seconds.**
    """)
    st.info("Demonstration Notice: In production, this QR code links to the school's unique reporting URL so parents and teachers can submit issues directly.")
