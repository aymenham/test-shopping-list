// Components/InvalidRecipesModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

type RecipeIssue = {
  recipeName: string;
  issues: string[];
};

export function InvalidRecipesModal({
  open,
  onClose,
  invalidRecipes,
}: {
  open: boolean;
  onClose: () => void;
  invalidRecipes: RecipeIssue[];
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>⚠️ Recipe Validation Issues</DialogTitle>
      <DialogContent dividers>
        {invalidRecipes.map((recipe, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <Typography variant="h6" gutterBottom>
              {recipe.recipeName}
            </Typography>
            <List dense>
              {recipe.issues.map((issue, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={`• ${issue}`} />
                </ListItem>
              ))}
            </List>
            {index < invalidRecipes.length - 1 && <Divider />}
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
