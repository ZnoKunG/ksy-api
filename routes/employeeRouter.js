const express = require('express');
const employeeRouter = express.Router();
const Employee = require('../models/employee');

employeeRouter.get('/employee', async (req, res) => {
    try {
        const employees = await Employee.find()
        res.status(200).json(employees)
    } catch (err) {
        res.status(500).json({ message: err.mesage })
    }
})
employeeRouter.get('/employee/birthday', paginatedResults, async (req, res) => {
    res.status(200).json(res.employees)
})

employeeRouter.get('/employee/:id', getEmployee, async (req, res) => {
    res.status(200).json(res.employee)
})

employeeRouter.post('/employee', async (req, res) => {
    try {
        await Employee.init()
        employeeData = { ...req.body }
        employeeData.birthDay = new Date(employeeData.birthDay)
        const employee = await Employee.create(employeeData)
        const newEmployee = await employee.save()
        res.status(201).json(newEmployee)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

employeeRouter.patch('/employee/:id', async (req, res) => {
    try {
        id = req.params.id
        const update = { ...req.body, updatedAt: Date.now() }
        const updatedEmployee = await Employee.findOneAndUpdate({ _id: id}, update, { new: true })
        return res.status(200).json(updatedEmployee)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

employeeRouter.delete('/employee/:id', getEmployee, async (req, res) => {
    try {
        await res.employee.remove()
        res.json({ message: `employee with name ${res.employee.name} was deleted`})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

employeeRouter.delete('/employee', async (req, res) => {
    try {
        const confirmDelete = req.query.confirm == "true" ? true : false
        if (confirmDelete) {
            await Employee.deleteMany({})
            res.status(202).json({ message: "All employees were deleted"})
        } else {
            res.status(400).json({message: "did not confirm to delete all employees"})
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getEmployee(req, res, next) { 
    let employee
    try {
        id = req.params.id
        employee = await Employee.findById(id)
        if (employee == null){
            return res.status(404).json( { message: `An employee from id ${id} Not Found`} )
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
    res.employee = employee
    next()
}

async function paginatedResults(req, res, next) { 
    let employees
    try {
        const dayOffset = parseInt(req.query.offset ?? "0")
        const date = new Date()
        date.setDate(date.getDate() + dayOffset)
        date.setUTCHours(0, 0, 0, 0)
        console.log(date)
        employees = await Employee.aggregate([
            {
                $project: {
                    name: "$name",
                    nickName: "$nickName",
                    month: { $month: "$birthDay" },
                    day: { $dayOfMonth: "$birthDay" }
                }
            },
            { $match: { "month": date.getMonth() + 1, "day": date.getDate() }}
        ])
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" })
    }

    // set limit and page and subject
    const limit = parseInt(req.query.limit ?? employees.length)
    const page = parseInt(req.query.page ?? "1")

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    employees = employees.slice(startIndex, endIndex) 
    
    res.employees = employees
    next()
}

module.exports = employeeRouter;
