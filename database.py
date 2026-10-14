"""
Database module for ShikshaSetu (SQLite)
GNIOT INNOVEX 2026 Ideathon Project
"""

import sqlite3
import os
from datetime import datetime, timedelta

DB_PATH = "shikshasetu.db"
UPLOADS_DIR = "uploads"

# Ensure upload directory exists
os.makedirs(UPLOADS_DIR, exist_ok=True)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Table 1: Complaints
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        school_name TEXT NOT NULL,
        location TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        reporter_role TEXT NOT NULL,
        photo_path TEXT,
        submitted_at TEXT NOT NULL,
        assigned_department TEXT,
        status TEXT NOT NULL,
        delay_reason TEXT,
        internal_notes TEXT,
        repair_photo_path TEXT,
        repair_notes TEXT,
        repair_reported_at TEXT,
        verifier_name TEXT,
        verifier_role TEXT,
        verification_result TEXT,
        verification_notes TEXT,
        verified_at TEXT,
        is_demo INTEGER DEFAULT 0
    )
    """)

    # Table 2: Status History
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS status_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        complaint_id TEXT NOT NULL,
        previous_status TEXT NOT NULL,
        new_status TEXT NOT NULL,
        note TEXT NOT NULL,
        author TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (complaint_id) REFERENCES complaints (id)
    )
    """)

    conn.commit()

    # Seed demo records if empty
    cursor.execute("SELECT COUNT(*) FROM complaints")
    count = cursor.fetchone()[0]

    if count == 0:
        seed_demo_data(conn)

    conn.close()

def seed_demo_data(conn):
    cursor = conn.cursor()
    now = datetime.now()

    demo_records = [
        (
            "SS-1001",
            "Government Model School — Demo",
            "Surajpur Block, Gautam Buddha Nagar",
            "Drinking Water",
            "Main outdoor drinking water tap fixture is cracked and leaking constantly. Children have to carry water from adjacent village well during midday meal.",
            "Teacher",
            None,
            (now - timedelta(days=4, hours=3)).strftime("%Y-%m-%d %H:%M:%S"),
            "Water Supply / Maintenance",
            "In Progress",
            None,
            "Work order #WM-402 issued to local pipeline technician.",
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            1
        ),
        (
            "SS-1002",
            "Government Model School — Demo",
            "Surajpur Block, Gautam Buddha Nagar",
            "Furniture",
            "Four dual-desk benches in Grade 6 classroom have fractured wooden tops and exposed rusted screws, posing injury hazard to students.",
            "Parent",
            None,
            (now - timedelta(days=1, hours=2)).strftime("%Y-%m-%d %H:%M:%S"),
            None,
            "Submitted",
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            1
        ),
        (
            "SS-1003",
            "Anganwadi Center 14 — Demo",
            "Dankaur Block, Greater Noida",
            "Toilets and Sanitation",
            "Girls toilet flush tank broken and drainage pipe blocked. Facility completely non-functional for past two weeks. Requires urgent sanitation intervention.",
            "School Management Committee Member",
            None,
            (now - timedelta(days=16, hours=5)).strftime("%Y-%m-%d %H:%M:%S"),
            "Sanitation / School Maintenance",
            "Under Review",
            "Sanitation contractor tendered across the block was delayed due to regional inventory shortage.",
            "Escalated to Block Education Officer on Day 10.",
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            1
        ),
        (
            "SS-1004",
            "Government Model School — Demo",
            "Surajpur Block, Gautam Buddha Nagar",
            "Electricity",
            "Main switchboard in primary wing sparking and circuit breaker trips whenever classroom fans are turned on. Wiring needs replacement.",
            "School Administrator",
            None,
            (now - timedelta(days=3, hours=4)).strftime("%Y-%m-%d %H:%M:%S"),
            "Electrical Maintenance",
            "Assigned",
            None,
            "Junior engineer scheduled for site audit on Thursday morning.",
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            1
        ),
        (
            "SS-1005",
            "Government Girls High School — Demo",
            "Kasna Block, Greater Noida",
            "Roof or Building Damage",
            "Heavy seepage and plaster peeling from ceiling in Science Lab during recent rainfall. Risk of falling masonry fragments.",
            "Teacher",
            None,
            (now - timedelta(days=8, hours=6)).strftime("%Y-%m-%d %H:%M:%S"),
            "Building Maintenance",
            "Verification Pending",
            None,
            "Technician completed physical works today. Verification pending from SMC.",
            None,
            "Polymer waterproofing layer applied over cracked roof slab, masonry re-plastered, and weather-seal coat cured.",
            (now - timedelta(hours=4)).strftime("%Y-%m-%d %H:%M:%S"),
            None,
            None,
            None,
            None,
            None,
            1
        ),
    ]

    cursor.executemany("""
    INSERT INTO complaints (
        id, school_name, location, category, description, reporter_role, photo_path,
        submitted_at, assigned_department, status, delay_reason, internal_notes,
        repair_photo_path, repair_notes, repair_reported_at, verifier_name,
        verifier_role, verification_result, verification_notes, verified_at, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, demo_records)

    # Initial history for demo items
    history_records = [
        ("SS-1001", "Submitted", "Submitted", "Complaint registered by Teacher via ShikshaSetu portal.", "Teacher", (now - timedelta(days=4, hours=3)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1001", "Submitted", "Under Review", "Initial review completed by District desk.", "District Desk", (now - timedelta(days=3, hours=8)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1001", "Under Review", "Assigned", "Assigned to Water Supply / Maintenance wing.", "Admin Desk", (now - timedelta(days=2, hours=6)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1001", "Assigned", "In Progress", "Field plumbing contractor reached school premises.", "Field Maintenance", (now - timedelta(days=1, hours=1)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1002", "Submitted", "Submitted", "Complaint registered by Parent via school QR poster.", "Parent", (now - timedelta(days=1, hours=2)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1003", "Submitted", "Submitted", "Urgent complaint registered by SMC member.", "SMC Member", (now - timedelta(days=16, hours=5)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1003", "Submitted", "Under Review", "Forwarded to Block Sanitation unit.", "District Desk", (now - timedelta(days=14, hours=2)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1004", "Submitted", "Submitted", "Electrical hazard reported by Headmaster.", "Administrator", (now - timedelta(days=3, hours=4)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1004", "Submitted", "Assigned", "Assigned to Electrical Maintenance wing.", "Control Cell", (now - timedelta(days=2, hours=2)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1005", "Submitted", "Submitted", "Roof leakage reported in Science Lab.", "Teacher", (now - timedelta(days=8, hours=6)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1005", "Submitted", "Assigned", "Assigned to Building Maintenance division.", "Infra Cell", (now - timedelta(days=7, hours=2)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1005", "Assigned", "In Progress", "Contractor mobilized scaffolding and materials.", "Contractor", (now - timedelta(days=4, hours=1)).strftime("%Y-%m-%d %H:%M:%S")),
        ("SS-1005", "In Progress", "Verification Pending", "Contractor completed waterproofing seal and reported repair. Ready for SMC verification.", "Contractor", (now - timedelta(hours=4)).strftime("%Y-%m-%d %H:%M:%S")),
    ]

    cursor.executemany("""
    INSERT INTO status_history (complaint_id, previous_status, new_status, note, author, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
    """, history_records)

    conn.commit()

def generate_next_id():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM complaints")
    rows = cursor.fetchall()
    conn.close()

    max_num = 1000
    for r in rows:
        cid = r["id"]
        if cid.startswith("SS-"):
            try:
                num = int(cid.split("-")[1])
                if num > max_num:
                    max_num = num
            except ValueError:
                pass
    return f"SS-{max_num + 1}"

def insert_complaint(school_name, location, category, description, reporter_role, photo_path=None):
    cid = generate_next_id()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO complaints (
        id, school_name, location, category, description, reporter_role,
        photo_path, submitted_at, status, is_demo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', 0)
    """, (cid, school_name, location, category, description, reporter_role, photo_path, now_str))

    cursor.execute("""
    INSERT INTO status_history (complaint_id, previous_status, new_status, note, author, timestamp)
    VALUES (?, 'Submitted', 'Submitted', ?, ?, ?)
    """, (cid, f"Complaint registered by {reporter_role} for {category}.", reporter_role, now_str))

    conn.commit()
    conn.close()
    return cid

def get_complaint(cid):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM complaints WHERE UPPER(id) = ?", (cid.strip().upper(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_complaint_history(cid):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM status_history WHERE UPPER(complaint_id) = ? ORDER BY id ASC", (cid.strip().upper(),))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_all_complaints():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM complaints ORDER BY submitted_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def update_status(cid, new_status, note, author="Authorized Staff"):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT status FROM complaints WHERE UPPER(id) = ?", (cid.strip().upper(),))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return False

    prev_status = row["status"]
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("UPDATE complaints SET status = ? WHERE UPPER(id) = ?", (new_status, cid.strip().upper()))
    cursor.execute("""
    INSERT INTO status_history (complaint_id, previous_status, new_status, note, author, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (cid.strip().upper(), prev_status, new_status, note, author, now_str))

    conn.commit()
    conn.close()
    return True

def assign_dept(cid, dept, internal_note="", delay_reason="", advance=True, author="District Desk"):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT status, internal_notes, delay_reason FROM complaints WHERE UPPER(id) = ?", (cid.strip().upper(),))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return False

    prev_status = row["status"]
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    target_status = "Assigned" if (advance and prev_status in ["Submitted", "Under Review"]) else prev_status

    cursor.execute("""
    UPDATE complaints
    SET assigned_department = ?, internal_notes = ?, delay_reason = ?, status = ?
    WHERE UPPER(id) = ?
    """, (dept, internal_note, delay_reason, target_status, cid.strip().upper()))

    note_text = f"Assigned to {dept}. {internal_note}".strip()
    cursor.execute("""
    INSERT INTO status_history (complaint_id, previous_status, new_status, note, author, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (cid.strip().upper(), prev_status, target_status, note_text, author, now_str))

    conn.commit()
    conn.close()
    return True

def report_repair(cid, notes, photo_path=None, author="Field Contractor Lead"):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT status FROM complaints WHERE UPPER(id) = ?", (cid.strip().upper(),))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return False

    prev_status = row["status"]
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
    UPDATE complaints
    SET status = 'Verification Pending', repair_notes = ?, repair_photo_path = ?, repair_reported_at = ?
    WHERE UPPER(id) = ?
    """, (notes, photo_path, now_str, cid.strip().upper()))

    cursor.execute("""
    INSERT INTO status_history (complaint_id, previous_status, new_status, note, author, timestamp)
    VALUES (?, ?, 'Verification Pending', ?, ?, ?)
    """, (cid.strip().upper(), prev_status, f"Repair completed: {notes}", author, now_str))

    conn.commit()
    conn.close()
    return True

def verify_repair(cid, result, notes, verifier_name, verifier_role):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT status FROM complaints WHERE UPPER(id) = ?", (cid.strip().upper(),))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return False

    prev_status = row["status"]
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_status = "Verified Resolved" if result == "Verified Resolved" else "Reopened"

    cursor.execute("""
    UPDATE complaints
    SET status = ?, verification_result = ?, verification_notes = ?, verifier_name = ?, verifier_role = ?, verified_at = ?
    WHERE UPPER(id) = ?
    """, (new_status, result, notes, verifier_name, verifier_role, now_str, cid.strip().upper()))

    hist_note = f"VERIFIED: {notes}" if new_status == "Verified Resolved" else f"REOPENED (Repair incomplete): {notes}"
    cursor.execute("""
    INSERT INTO status_history (complaint_id, previous_status, new_status, note, author, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (cid.strip().upper(), prev_status, new_status, hist_note, f"{verifier_name} ({verifier_role})", now_str))

    conn.commit()
    conn.close()
    return True

def reset_db_demo():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    init_db()
