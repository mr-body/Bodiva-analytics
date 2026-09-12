"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({ from, to, onChange }: { from: Date | undefined; to: Date | undefined; onChange: (range: DateRange | undefined) => void }) {
    return (
        <Field className="mx-auto w-60">
            <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
            <Popover>
                <PopoverTrigger render={<Button variant="outline" id="date-picker-range" className="justify-start px-2.5 font-normal"><CalendarIcon data-icon="inline-start" />{from ? (
                    to ? (
                        <>
                            {format(from, "LLL dd, y")} -{" "}
                            {format(to, "LLL dd, y")}
                        </>
                    ) : (
                        format(from, "LLL dd, y")
                    )
                ) : (
                    <span>Pick a date</span>
                )}</Button>} />
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        defaultMonth={from}
                        selected={{ from, to }}
                        onSelect={onChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}
