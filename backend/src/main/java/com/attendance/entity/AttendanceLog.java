package com.attendance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "attendance_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, name = "class_name")
    private String className; // e.g. "10A"

    @Column(nullable = false)
    private Integer totalStudents;

    @Column(nullable = false)
    private Integer presentCount;

    @Column(nullable = false)
    private Integer absentCount;

    @Column(nullable = false)
    private String teacherName;

    @Column(nullable = false)
    private String syncStatus; // e.g., "Synced", "Pending"
}
