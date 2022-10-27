const express = require('express');
const employeeRouter = express.Router();
const Employee = require('../models/employee');

employeeRouter.get('/employee', paginatedResults, async (req, res) => {
    res.status(200).json(res.employees)
})

employeeRouter.get('/employee/:id', getEmployee, async (req, res) => {
    res.status(200).json(res.employee)
})

employeeRouter.post('/employee', async (req, res) => {
    try {
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
        res.json({ message: `employee with name ${res.employee.firstName} ${res.employee.lastName} was deleted`})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

employeeRouter.delete('/employee', async (req, res) => {
    try {
        const confirmDelete = req.query.confirm == "true" ? true : false
        if (confirmDelete){
            Employee.deleteMany({})
            res.json({ mesage: "All employees were deleted"})
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
        return res.status(500).json({ message: err.message })
    }
    res.employee = employee
    next()
}

async function paginatedResults(req, res, next) { 
    let employees
    
    try {
        const subject = req.query.subject ?? ""
        if (subject == "") {
            employees = await Employee.find()
        }
        else {
            employees = await Employee.find({ subject: subject })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
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
