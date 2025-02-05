import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, RotateCcw } from "lucide-react";
import { useFairSplitStore } from "./store";

const getShare = (earning: number, totalEarning: number) => {
  if (totalEarning === 0) return 0;
  return (earning / totalEarning) * 100;
};

const calculateSharePerExpense = (
  expenseAmount: number,
  totalEarning: number,
  personEarning: number
) => {
  if (totalEarning === 0) return 0;
  return ((expenseAmount / totalEarning) * personEarning).toFixed(2);
};

export default function App() {
  const {
    persons,
    expenses,
    totalEarning,
    addPerson,
    updatePerson,
    removePerson,
    addExpense,
    updateExpense,
    resetStore,
    removeExpense,
  } = useFairSplitStore();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const totalEarningValue = totalEarning();

  return (
    <div className="container mx-auto py-8 space-y-8 px-4 md:px-0">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Fair Split</h1>
        <p className="text-muted-foreground">
          Fairly split expenses among individuals based on their earnings,
          ensuring proportional contributions to shared costs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Who?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {persons.map((person, index) => (
              <div key={index} className="flex items-end space-x-4">
                <div className="flex-grow grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`person-${index}`}>Name</Label>
                    <Input
                      type="text"
                      id={`person-${index}`}
                      value={person.name}
                      onChange={(event) =>
                        updatePerson(index, { name: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`earning-${index}`}>Earning</Label>
                    <Input
                      type="number"
                      id={`earning-${index}`}
                      value={person.earning}
                      onChange={(event) =>
                        updatePerson(index, {
                          earning: Number(event.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removePerson(index)}
                  className="mb-[2px]"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={addPerson} className="mt-4">
            Add Person
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <div key={index} className="flex items-end space-x-4">
                <div className="flex-grow grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`expense-${index}`}>Name</Label>
                    <Input
                      type="text"
                      id={`expense-${index}`}
                      value={expense.name}
                      onChange={(event) =>
                        updateExpense(index, { name: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`amount-${index}`}>Amount</Label>
                    <Input
                      type="number"
                      id={`amount-${index}`}
                      value={expense.amount}
                      onChange={(event) =>
                        updateExpense(index, {
                          amount: Number(event.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeExpense(index)}
                  className="mb-[2px]"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={addExpense} className="mt-4">
            Add Expense
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Share per person</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Share</TableHead>
                {expenses.map((expense, index) => (
                  <TableHead key={index}>{expense.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {persons.map((person, personIndex) => (
                <TableRow key={personIndex}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>
                    {getShare(person.earning, totalEarningValue).toFixed(2)}%
                  </TableCell>
                  {expenses.map((expense, expenseIndex) => (
                    <TableCell key={expenseIndex}>
                      {calculateSharePerExpense(
                        expense.amount,
                        totalEarningValue,
                        person.earning
                      )}
                      €
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button variant="outline" onClick={() => setIsResetModalOpen(true)}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset All
      </Button>

      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to reset?</DialogTitle>
            <DialogDescription>
              This action will remove all persons and expenses. This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetStore();
                setIsResetModalOpen(false);
              }}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
