import React from 'react';

const FormStructure = () => {
  return (
    <div>
           <Grid container spacing={3}>
                {formStructure.map((field) => (
                  <Grid item xs={12} 
                  md={field.type === "text" 
                      || field.type === "number" 
                      || field.type ==="select"
                      || field.type ==="email" ? 2 : 12}
                  key={field.id}>
                    {field.type === "select" ? (
                      <FormControl   variant="standard"  fullWidth>
                        <InputLabel id={`${field.id}-label`} shrink>
                          {field.label} 
                        </InputLabel>
                        <Select 
                          id={field.id} 
                          name={field.id} 
                          value={formData[field.id]} 
                          onChange={handleChange} 
                          labelId={`${field.id}-label`}>
                          {Array.isArray(field.options)
                            ? field.options.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))
                            : null}
                        </Select>
                      </FormControl>
                    ) : field.type === "text" ? (
                      <TextField 
                        id={field.id} 
                        name={field.id} 
                        label={field.label} 
                        variant="standard" 
                        value={formData[field.id]} 
                        onChange={handleChange} 
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth />
                    ) : field.type === "email" ? (
                    <TextField 
                      id={field.id} 
                      name={field.id} 
                      label={field.label} 
                      variant="standard" 
                      value={formData[field.id]} 
                      onChange={handleChange} 
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth />
                  ): field.type === "number" ? (
                      <TextField 
                        id={field.id} 
                        name={field.id} 
                        label={field.label} 
                        variant="standard" 
                        value={formData[field.id]} 
                        onChange={handleChange} 
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth />
                    ): (
                      <TextField 
                        id={field.id} 
                        name={field.id} 
                        label={field.label} 
                        type={field.type} 
                        variant="outlined" 
                        value={formData[field.id]} 
                        onChange={handleChange} 
                        fullWidth 

                        multiline rows={field.rows || 3}  />
                    )}
                  </Grid>
                ))}

                 {/* Comments Field */}
                <Grid item xs={12}>
                  <TextField
                    id="comments"
                    name="comments"
                    label="Comments"
                    variant="outlined"
                    value={formData.comments || ""}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2} // Adjust rows as needed
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} >
                  <Grid item xs={12} sm={3}>
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
    </div>
  );
}

export default FormStructure;
