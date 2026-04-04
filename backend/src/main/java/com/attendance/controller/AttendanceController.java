package com.attendance.controller;

import com.attendance.entity.AttendanceLog;
import com.attendance.repository.AttendanceLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceLogRepository attendanceLogRepository;

    @GetMapping
    public List<AttendanceLog> getAllLogs() {
        return attendanceLogRepository.findAll();
    }

    @PostMapping
    public AttendanceLog saveLog(@RequestBody AttendanceLog log) {
        return attendanceLogRepository.save(log);
    }
}
