import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { studentService } from "@/lib/services/student.service";
import { workoutService } from "@/lib/services/workout.service";
import { Student } from "@/lib/types/student.types";
import { UserCheck } from "lucide-react";

interface AssignWorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutId: string;
  workoutTitle: string;
  onAssigned?: () => void;
}

export function AssignWorkoutModal({
  open,
  onOpenChange,
  workoutId,
  workoutTitle,
  onAssigned,
}: AssignWorkoutModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    if (open) {
      loadStudents();
    }
  }, [open]);

  async function loadStudents() {
    try {
      setLoadingStudents(true);
      const data = await studentService.list();
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students", error);
    } finally {
      setLoadingStudents(false);
    }
  }

  async function handleAssign() {
    if (!selectedStudent) return;

    try {
      setLoading(true);
      await workoutService.assignWorkout(selectedStudent, workoutId, notes);
      onOpenChange(false);
      setSelectedStudent("");
      setNotes("");
      onAssigned?.();
    } catch (error) {
      console.error("Failed to assign workout", error);
      alert("Erro ao atribuir treino");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-red-500" />
            Atribuir Treino
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Atribuir "{workoutTitle}" a um aluno
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="student">Selecionar Aluno</Label>
            {loadingStudents ? (
              <div className="text-sm text-zinc-500">Carregando alunos...</div>
            ) : (
              <select
                id="student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Selecione um aluno</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione instruções ou observações para o aluno..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-zinc-800 border-white/10 text-white min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-white hover:bg-white/5"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedStudent || loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Atribuindo..." : "Atribuir Treino"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
